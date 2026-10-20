// Lake surface shaders. They replace three's Water shaders but keep its planar mirror
// (mirrorSampler/textureMatrix/eye are still filled in by Water's onBeforeRender).
//
// shoreMap stores the signed distance (m) from the waterline: negative on land, growing out
// over the lake. It drives wave calming, shallow-to-deep colour, see-through shallows and foam.

export const SHORE_MIN = -4;
export const SHORE_RANGE = 32;


// Shared by the lake surface and the bank: noise, lacy foam and the swash cycle, so waves
// arriving in the water and water running up the sand stay in step.
export const shoreBase = /* glsl */ `
  float shoreAt(vec2 xz) {
    vec2 uv = (xz - shoreBounds.xy) / shoreBounds.zw;
    return texture2D(shoreMap, uv).r * ${SHORE_RANGE.toFixed(1)} + ${SHORE_MIN.toFixed(1)};
  }
  float h12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vn(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y);
  }
`;

// Fragment-only (uses fwidth): foam and the swash cycle.
export const shoreCommon = /* glsl */ `
  ${shoreBase}
  // distances to the nearest and second-nearest cell points
  vec2 voronoi(vec2 x) {
    vec2 n = floor(x), f = fract(x);
    float f1 = 8.0, f2 = 8.0;
    for (int j = -1; j <= 1; j++)
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = vec2(h12(n + g), h12(n + g + 17.31));
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
      }
    return sqrt(vec2(f1, f2));
  }
  // Sea foam: warped, uneven bubble walls gathered into clumps and dense blotches, with
  // clear water between, plus a few round bubbles. Fine detail fades out once it would be
  // smaller than a pixel, so distant foam doesn't sparkle.
  float foamLace(vec2 p, float t) {
    float px = length(fwidth(p));
    vec2 warp = vec2(vn(p * 1.7 + 11.0), vn(p * 1.7 + 23.0)) - 0.5;
    vec2 q = p * 4.5 + warp * 2.4 + vec2(t * 0.12, -t * 0.08);
    vec2 v = voronoi(q);
    float wall = mix(0.04, 0.2, vn(p * 2.6 + 7.0));
    float lace = 1.0 - smoothstep(wall * 0.35, wall, v.y - v.x);
    lace = mix(lace, 0.35, smoothstep(0.04, 0.12, px * 4.5));
    float blot = smoothstep(0.55, 0.85, vn(p * 2.3 + warp * 1.5 + vec2(t * 0.1, 0.0)));
    float clumps = smoothstep(0.4, 0.8, vn(p * 1.1 + vec2(t * 0.06, t * 0.03)));
    vec2 bq = p * 14.0 + warp * 3.0 - vec2(t * 0.15, t * 0.05);
    vec2 b = voronoi(bq);
    float rare = step(0.85, h12(floor(bq)));
    float rim = smoothstep(0.24, 0.18, b.x) * smoothstep(0.1, 0.16, b.x) * rare;
    rim *= 1.0 - smoothstep(0.02, 0.06, px * 14.0);
    return clamp(max(lace, blot) * clumps + rim * 0.6, 0.0, 1.0);
  }
  // Swash: each wave's phase along the shore, and how far up the bank it runs (m).
  float swashPhase(vec2 p, float t) { return t * 0.38 + vn(p * 0.07) * 1.7; }
  float runupMax(vec2 p) { return 0.9 + 0.9 * vn(p * 0.11 + 3.7); }
  // reach at cycle position c: rushes up in the first 30%, then drains back slowly
  float swashReach(float c, float maxR) {
    return maxR * (c < 0.3 ? smoothstep(0.0, 0.3, c) : 1.0 - smoothstep(0.3, 0.97, c));
  }
`;

export const lakeVertex = /* glsl */ `
  uniform mat4 textureMatrix;
  uniform float time;
  uniform sampler2D shoreMap;
  uniform vec4 shoreBounds; // minX, minZ, sizeX, sizeZ

  varying vec4 mirrorCoord;
  varying vec4 worldPosition;
  varying vec3 vWaveNormal;
  varying float vShore;

  #include <common>
  #include <fog_pars_vertex>
  #include <shadowmap_pars_vertex>
  #include <logdepthbuf_pars_vertex>

  ${shoreBase}

  // One Gerstner wave (direction xy, steepness z, wavelength w). Accumulates the displacement
  // and the surface tangents, from which the exact normal follows.
  void gerstner(vec4 w, vec2 p, float t, inout vec3 disp, inout vec3 tx, inout vec3 tz) {
    float k = 2.0 * PI / w.w;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(w.xy);
    float f = k * (dot(d, p) - c * t);
    float a = w.z / k;
    float s = sin(f);
    float co = cos(f);
    disp += vec3(d.x * a * co, a * s, d.y * a * co);
    tx += vec3(-d.x * d.x * w.z * s, d.x * w.z * co, -d.x * d.y * w.z * s);
    tz += vec3(-d.x * d.y * w.z * s, d.y * w.z * co, -d.y * d.y * w.z * s);
  }

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    float shore = shoreAt(wp.xz);
    float calm = smoothstep(0.0, 9.0, shore); // swell dies down toward the bank

    float t = time * 0.7;
    vec3 disp = vec3(0.0);
    vec3 tx = vec3(1.0, 0.0, 0.0);
    vec3 tz = vec3(0.0, 0.0, 1.0);
    gerstner(vec4(1.0, 0.35, 0.06, 16.0), wp.xz, t, disp, tx, tz);
    gerstner(vec4(0.6, -0.8, 0.045, 9.5), wp.xz, t, disp, tx, tz);
    gerstner(vec4(-0.2, 1.0, 0.03, 6.5), wp.xz, t, disp, tx, tz);
    wp.xyz += disp * calm;
    vWaveNormal = normalize(mix(vec3(0.0, 1.0, 0.0), normalize(cross(tz, tx)), calm));
    vShore = shore;

    worldPosition = wp;
    mirrorCoord = textureMatrix * wp;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;

    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    #include <shadowmap_vertex>
  }
`;

export const lakeFragment = /* glsl */ `
  uniform sampler2D mirrorSampler;
  uniform sampler2D normalSampler;
  uniform float time;
  uniform vec3 sunColor;
  uniform vec3 sunDirection;
  uniform vec3 eye;
  uniform sampler2D shoreMap;
  uniform vec4 shoreBounds;

  varying vec4 mirrorCoord;
  varying vec4 worldPosition;
  varying vec3 vWaveNormal;
  varying float vShore;

  #include <common>
  #include <packing>
  #include <bsdfs>
  #include <fog_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <lights_pars_begin>
  #include <shadowmap_pars_fragment>
  #include <shadowmask_pars_fragment>

  ${shoreCommon}
  vec2 ripple(vec2 uv) { return texture2D(normalSampler, uv).xy * 2.0 - 1.0; }

  void main() {
    #include <logdepthbuf_fragment>
    vec2 p = worldPosition.xz;
    float t = time;

    // Wind gusts: patches of rougher and glassier water drifting across the lake.
    float gust = vn(p * 0.035 + vec2(t * 0.05, t * 0.02)) * 0.65
               + vn(p * 0.11 - vec2(t * 0.08, -t * 0.03)) * 0.35;
    gust = smoothstep(0.25, 0.85, gust);

    // Three scales of ripples, each drifting its own way.
    vec2 r = ripple(p * 0.45 + vec2(t * 0.035, t * 0.02)) * 0.55
           + ripple(p * 0.23 - vec2(t * 0.02, -t * 0.03)) * 0.6
           + ripple(p * 1.3 + vec2(-t * 0.07, t * 0.05)) * 0.35 * (0.4 + 0.6 * gust);
    float nearBank = smoothstep(-0.5, 4.0, vShore);
    float strength = mix(0.16, 0.5, gust) * mix(0.5, 1.0, nearBank);
    vec3 N = normalize(vWaveNormal + vec3(r.x, 0.0, r.y) * strength);

    vec3 toEye = eye - worldPosition.xyz;
    float dist = length(toEye);
    vec3 V = toEye / dist;
    // far away the ripples average out instead of shimmering
    N = normalize(mix(N, vWaveNormal, smoothstep(30.0, 140.0, dist) * 0.7));

    // Small waves rolling in to the bank: crests travel shoreward, steepen and break, timed so
    // each one arrives as the swash on the sand begins.
    float phase = swashPhase(p, t);
    float wv = fract(phase + vShore / 3.0);
    float nearShore = smoothstep(7.0, 2.0, vShore) * smoothstep(-0.3, 0.4, vShore);
    float crest = pow(1.0 - wv, 6.0) * nearShore;
    vec2 gs = vec2(shoreAt(p + vec2(0.5, 0.0)) - shoreAt(p - vec2(0.5, 0.0)),
                   shoreAt(p + vec2(0.0, 0.5)) - shoreAt(p - vec2(0.0, 0.5)));
    gs = length(gs) > 1e-4 ? normalize(gs) : vec2(0.0);
    float slope = 6.0 * pow(1.0 - wv, 5.0) / 3.0 * nearShore;
    N = normalize(N + vec3(gs.x, 0.0, gs.y) * slope * 0.35);

    float cosT = max(dot(V, N), 0.0);
    float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);

    vec2 distort = N.xz * 0.35 / (1.0 + dist * 0.15);
    vec3 refl = texture2D(mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distort).rgb;

    float shadow = getShadowMask();
    float sunDiff = max(dot(N, sunDirection), 0.0);

    // Water body: clear green-turquoise in the shallows, deep teal further out.
    float depthT = smoothstep(0.0, 7.0, vShore);
    vec3 shallow = vec3(0.10, 0.30, 0.27);
    vec3 deep = vec3(0.012, 0.06, 0.075);
    vec3 body = mix(shallow, deep, depthT) * (0.45 + 0.55 * sunDiff * mix(0.5, 1.0, shadow)) * sunColor;

    // Sun glints: a sharp core plus a soft sheen.
    float sp = max(dot(reflect(-sunDirection, N), V), 0.0);
    vec3 spec = sunColor * (pow(sp, 900.0) * 9.0 + pow(sp, 120.0) * 0.35) * shadow;

    vec3 col = mix(body, refl, F) + spec;

    // Foam: lace on breaking crests, whitewash at the waterline as each wave runs in, and a
    // thin scatter of bubbles drifting on the shallows.
    float lace = foamLace(p, t);
    float c = fract(phase);
    float wash = (1.0 - smoothstep(0.0, 1.2, vShore)) * (c < 0.45 ? 1.0 : 1.0 - smoothstep(0.45, 0.9, c));
    float crestFoam = smoothstep(0.35, 0.9, crest) * smoothstep(0.6, 2.5, vShore);
    float drift = (1.0 - smoothstep(0.5, 4.0, vShore)) * 0.12;
    float foam = clamp(lace * max(max(crestFoam, wash), drift) * 1.4, 0.0, 1.0);
    col = mix(col, vec3(0.9, 0.93, 0.92) * (0.65 + 0.35 * shadow), foam * 0.85);

    // See-through in the shallows (the bank shows), opaque where it's deep.
    float alpha = mix(0.35, 1.0, smoothstep(0.0, 2.8, vShore));
    alpha = max(alpha, max(F, foam * 0.8));

    gl_FragColor = vec4(col, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;
