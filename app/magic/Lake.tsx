"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { PATH_LEN, path } from "./world";
import { SHORE_MIN, SHORE_RANGE, lakeFragment, lakeVertex, shoreCommon } from "./lakeShader";

const GRASS = ["diff", "nor_gl", "rough"].map((m) => `/models/sakura/grass_${m}_1k.jpg`);
useTexture.preload(GRASS);

export const WATER_Y = -0.14;
const SHORE = 3; // metres of bank sloping down into the water
// The bank (y = -0.9 * smoothstep over SHORE metres) meets the water this far inside the edge.
const WATERLINE_INSET = 2.25;
const CAP = 16; // the land runs this far past each end of the path, rounding off

// Half-width of the land strip at distance s along the path: a wobbly shoreline that never
// comes closer than 13 m, so the cherry trees (6-10 m out) always stand on grass.
const halfWidth = (s: number) => 16 + 2 * Math.sin(s * 0.071 + 0.5) + Math.sin(s * 0.19 + 2.1);

// Centre line of the land: the path itself, plus straight run-offs past both ends.
function centreLine(step = 0.6) {
  const out: { p: THREE.Vector3; side: THREE.Vector3; w: number }[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const push = (p: THREE.Vector3, tan: THREE.Vector3, s: number, taper: number) =>
    out.push({ p, side: new THREE.Vector3().crossVectors(tan, up).normalize(), w: halfWidth(s) * taper });
  const t0 = path.getTangentAt(0);
  const t1 = path.getTangentAt(1);
  const p0 = path.getPointAt(0);
  const p1 = path.getPointAt(1);
  for (let k = CAP; k > 0; k -= step)
    push(p0.clone().addScaledVector(t0, -k), t0, -k, Math.sqrt(Math.max(0.02, 1 - (k / CAP) ** 2)));
  const n = Math.ceil(PATH_LEN / step);
  for (let i = 0; i <= n; i++) push(path.getPointAt(i / n), path.getTangentAt(i / n), (i / n) * PATH_LEN, 1);
  for (let k = step; k <= CAP; k += step)
    push(p1.clone().addScaledVector(t1, k), t1, PATH_LEN + k, Math.sqrt(Math.max(0.02, 1 - (k / CAP) ** 2)));
  return out;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Wave clock and shoreline map, shared by the water and the bank so their waves line up.
const lakeTime = { value: 0 };
let shoreMap: THREE.DataTexture | null = null;
const getShoreMap = () => (shoreMap ??= makeShoreMap());

// The bank's shader: each wave runs up the sand as a thin glossy sheet with a bubbly foam
// edge, then drains back, leaving the sand dark and wet up to where it reached.
function addSwash(mat: THREE.MeshStandardMaterial) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.time = lakeTime;
    shader.uniforms.shoreMap = { value: getShoreMap() };
    shader.uniforms.shoreBounds = { value: shoreBoundsVec };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLakeWorld;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvLakeWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float time;
        uniform sampler2D shoreMap;
        uniform vec4 shoreBounds;
        varying vec3 vLakeWorld;
        ${shoreCommon}
        float swFilm = 0.0;
        float swWet = 0.0;
        float swFoam = 0.0;`,
      )
      .replace(
        "#include <map_fragment>",
        /* glsl */ `#include <map_fragment>
        {
          vec2 p = vLakeWorld.xz;
          float up = -shoreAt(p);               // metres up the bank from the waterline
          float c = fract(swashPhase(p, time));
          float maxR = runupMax(p);
          float reach = swashReach(c, maxR);
          float edgeNoise = (vn(p * 3.0 + time * 0.2) - 0.5) * 0.18;
          float r = reach + edgeNoise;
          swFilm = smoothstep(r, r - 0.12, up) * step(-0.2, up);
          // foam rides the leading edge on the way up; a thinner trail as it drains
          float rushing = c < 0.3 ? 1.0 : 1.0 - smoothstep(0.3, 0.75, c);
          float band = 1.0 - smoothstep(0.0, mix(0.12, 0.35, rushing), abs(up - r));
          float lace = foamLace(p, time);
          // bubbles stranded on the sand the water just left, popping as it drains
          float stranded = (c > 0.3 ? 1.0 - smoothstep(0.3, 0.95, c) : 0.0)
                         * smoothstep(r, r + 0.15, up) * smoothstep(maxR + 0.1, maxR - 0.2, up);
          swFoam = clamp(lace * (band * (0.55 + 0.45 * rushing) + swFilm * 0.25 + stranded * 0.4), 0.0, 1.0) * step(-0.2, up);
          // sand stays wet up to the highest reach, drying slowly above it
          swWet = smoothstep(maxR + 0.35, maxR - 0.15, up) * step(-0.2, up);
          diffuseColor.rgb *= 1.0 - 0.38 * swWet;
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.55, 0.68, 0.66), swFilm * 0.7);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.88, 0.91, 0.9), swFoam * 0.85);
        }`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.35, swWet * 0.7);
        roughnessFactor = mix(roughnessFactor, 0.04, swFilm * (1.0 - swFoam));`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        normal = normalize(mix(normal, nonPerturbedNormal, swFilm * 0.85));`,
      );
  };
  mat.customProgramCacheKey = () => "lake-bank-swash";
}

// Grassy strip the path runs along. Its edges slope under the water, and the grass gives way
// to wet, sandy mud near the waterline.
export function Land() {
  const [diff, nor, rough] = useTexture(GRASS, (texs) => {
    texs.forEach((t, i) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      t.colorSpace = i === 0 ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.needsUpdate = true; // re-upload: wrap mode and colour space were set after load
    });
  });
  const geo = useMemo(() => {
    const line = centreLine();
    const M = 28; // vertices across
    const pos: number[] = [];
    const uv: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    line.forEach(({ p, side, w }, i) => {
      for (let j = 0; j < M; j++) {
        const t = -1 + (2 * j) / (M - 1);
        // pack more vertices near the shore, where the slope is
        const d = Math.sign(t) * Math.pow(Math.abs(t), 0.6) * w;
        const ad = Math.abs(d);
        const inner = w - SHORE;
        // gentle bumps in the meadow, flat under the path and sloping away at the shore
        const bumps = 0.05 * Math.sin(p.x * 0.3 + p.z * 0.2 + d * 0.4) * smoothstep(2, 4, ad) * (1 - smoothstep(inner - 2, inner, ad));
        const y = -0.9 * smoothstep(inner, w, ad) + bumps;
        const x = p.x + side.x * d;
        const z = p.z + side.z * d;
        pos.push(x, y, z);
        uv.push(x * 0.35, z * 0.35);
        // grass gives way to damp, sandy mud at the waterline
        const mud = smoothstep(inner - 1.6, inner + 0.7, ad);
        const dark = 1 - 0.3 * smoothstep(inner + 0.5, w, ad);
        col.push((1 - 0.2 * mud) * dark, (1 - 0.36 * mud) * dark, (1 - 0.55 * mud) * dark);
      }
      if (i < line.length - 1) {
        const a = i * M;
        const b = (i + 1) * M;
        for (let j = 0; j < M - 1; j++) idx.push(a + j, a + j + 1, b + j, a + j + 1, b + j + 1, b + j);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);
  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: diff,
      normalMap: nor,
      roughnessMap: rough,
      vertexColors: true,
      color: "#c9d6b0",
      envMapIntensity: 0.6,
    });
    addSwash(m);
    return m;
  }, [diff, nor, rough]);
  return <mesh geometry={geo} material={mat} receiveShadow />;
}

// Tileable ripple normal map, built from a sum of waves with whole-number frequencies so it
// wraps seamlessly.
function makeWaterNormals(size = 256) {
  let seed = 12345;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const waves = Array.from({ length: 48 }, () => {
    const kx = Math.round((rnd() - 0.5) * 30);
    const ky = Math.round((rnd() - 0.5) * 30);
    const k = Math.hypot(kx, ky) || 1;
    return { kx, ky, a: 1 / Math.pow(k, 1.3), ph: rnd() * Math.PI * 2 };
  });
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      let v = 0;
      for (const w of waves) v += w.a * Math.sin(2 * Math.PI * (w.kx * x + w.ky * y) / size + w.ph);
      h[y * size + x] = v;
    }
  const data = new Uint8Array(size * size * 4);
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)];
  const strength = 3.5;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const n = new THREE.Vector3(-dx, -dy, 1).normalize();
      const o = (y * size + x) * 4;
      data[o] = (n.x * 0.5 + 0.5) * 255;
      data[o + 1] = (n.y * 0.5 + 0.5) * 255;
      data[o + 2] = (n.z * 0.5 + 0.5) * 255;
      data[o + 3] = 255;
    }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// Signed distance (m) from the waterline for the area around the land, stored as a small
// 1 m-per-texel map. Negative on land, positive over the lake.
const SHORE_BOUNDS = { minX: -64, minZ: -245, sizeX: 128, sizeZ: 325 };
const shoreBoundsVec = new THREE.Vector4(SHORE_BOUNDS.minX, SHORE_BOUNDS.minZ, SHORE_BOUNDS.sizeX, SHORE_BOUNDS.sizeZ);
function makeShoreMap() {
  const W = SHORE_BOUNDS.sizeX;
  const H = SHORE_BOUNDS.sizeZ;
  const line = centreLine(1.2);
  const data = new Uint8Array(W * H);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const x = SHORE_BOUNDS.minX + i + 0.5;
      const z = SHORE_BOUNDS.minZ + j + 0.5;
      let d = Infinity;
      for (const { p, w } of line) d = Math.min(d, Math.hypot(x - p.x, z - p.z) - (w - WATERLINE_INSET));
      data[j * W + i] = Math.round(Math.min(1, Math.max(0, (d - SHORE_MIN) / SHORE_RANGE)) * 255);
    }
  const tex = new THREE.DataTexture(data, W, H, THREE.RedFormat);
  tex.magFilter = tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// The lake: three's Water supplies the planar mirror; the surface itself is our own shader
// (Gerstner swell, gusty ripples, depth colour, see-through shallows, shoreline foam).
export function Lake({ sunDirection }: { sunDirection: THREE.Vector3 }) {
  const water = useMemo(() => {
    const w = new Water(new THREE.PlaneGeometry(600, 600, 400, 400), {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: makeWaterNormals(),
      sunDirection: sunDirection.clone(),
      sunColor: 0xfff4e2,
      fog: true,
    });
    w.rotation.x = -Math.PI / 2;
    w.position.set(0, WATER_Y, -80);
    const mat = w.material as THREE.ShaderMaterial;
    mat.uniforms.time = lakeTime;
    mat.uniforms.shoreMap = { value: getShoreMap() };
    mat.uniforms.shoreBounds = { value: shoreBoundsVec };
    mat.vertexShader = lakeVertex;
    mat.fragmentShader = lakeFragment;
    mat.transparent = true;
    mat.needsUpdate = true;
    return w;
  }, [sunDirection]);

  useFrame((_, dt) => {
    lakeTime.value += dt;
  });

  return (
    <>
      <primitive object={water} />
      {/* muddy lake bed, seen through the shallows */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.4, -80]}>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#3b3826" roughness={1} />
      </mesh>
    </>
  );
}
