"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars, useGLTF, useTexture } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { stations, type Station } from "./content";
import { makeGlyphTexture } from "./glyphs";
import { scrollState } from "./scroll";

const BG = "#050816";

// The winding path the camera follows.
const path = new THREE.CatmullRomCurve3(
  [
    [0, 0, 0],
    [2, 0, -22],
    [-3, 0, -46],
    [3, 0, -70],
    [-2, 0, -94],
    [2, 0, -118],
    [0, 0, -142],
    [0, 0, -165],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
);
const PATH_LEN = path.getLength();
const UP = new THREE.Vector3(0, 1, 0);

// Three carved variants baked in Blender (blender/*.py): a textured "Stone" mesh plus a
// vertex-coloured "Debris" mesh (moss + rubble). Origin is bottom-centre, front faces +Z.
const STONE_TAGS = ["a", "b", "c"] as const;
const stoneUrl = (t: string) => `/models/runestone_${t}.glb`;
const texUrls = (t: string) => [
  `/models/runestone_${t}_color.jpg`,
  `/models/runestone_${t}_normal.jpg`,
  `/models/runestone_${t}_orm.jpg`,
];
STONE_TAGS.forEach((t) => {
  useGLTF.preload(stoneUrl(t));
  useTexture.preload(texUrls(t));
});
const STONE_SINK = 0.12; // bury the base slightly so it sits in the ground
const MEDALLION_X = 0.1;
const MEDALLION_Y = 2.6 - STONE_SINK;

// Procedural fine grain layered on top of the baked maps: object-space micro-bump and
// roughness variation, plus (for the stone) baked AO and the glowing carved runes.
function patchStoneShader(
  mat: THREE.MeshStandardMaterial,
  opts: { bump: number; glow?: { current: number } },
) {
  const stone = !!opts.glow;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uBump = { value: opts.bump };
    if (opts.glow) {
      const g = opts.glow;
      shader.uniforms.uGlow = { get value() { return g.current; } };
    }
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObjPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjPos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
        varying vec3 vObjPos;
        uniform float uBump;
        ${stone ? "uniform float uGlow;" : ""}
        float h31(vec3 p){ p = fract(p*0.3183099+0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
        float vnoise(vec3 x){
          vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x), f.y),
                     mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x), f.y), f.z);
        }
        // Octaves fade out when they would alias at the current pixel size.
        float stoneH(vec3 p, float px){
          float w2 = 1.0 - smoothstep(0.2, 0.5, 95.0*px);
          float w3 = 1.0 - smoothstep(0.2, 0.5, 260.0*px);
          return vnoise(p*34.0)*0.55 + vnoise(p*95.0)*0.30*w2 + vnoise(p*260.0)*0.15*w3;
        }
        vec3 bumpNormal(vec3 surfPos, vec3 surfNorm, vec2 dHdxy, float faceDir){
          vec3 sx = normalize(dFdx(surfPos)), sy = normalize(dFdy(surfPos));
          vec3 r1 = cross(sy, surfNorm), r2 = cross(surfNorm, sx);
          float det = dot(sx, r1) * faceDir;
          vec3 g = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
          return normalize(abs(det) * surfNorm - g);
        }`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        /* glsl */ `#include <roughnessmap_fragment>
        float sPx = length(fwidth(vObjPos));
        float sH = stoneH(vObjPos, sPx);
        roughnessFactor = clamp(roughnessFactor + (sH - 0.5) * ${stone ? "0.18" : "0.35"}, 0.3, 1.0);
        diffuseColor.rgb *= ${stone ? "0.94 + 0.12" : "0.88 + 0.24"} * sH;
        ${
          stone
            ? `#ifdef USE_ROUGHNESSMAP
        vec3 ormSample = texture2D( roughnessMap, vRoughnessMapUv ).rgb;
        diffuseColor.rgb *= mix(1.0, ormSample.r, 0.75);
        #endif`
            : ""
        }`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        /* glsl */ `#include <normal_fragment_maps>
        normal = bumpNormal(-vViewPosition, normal, vec2(dFdx(sH), dFdy(sH)) * uBump, faceDirection);`,
      );
    if (stone) {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `#include <emissivemap_fragment>
        #ifdef USE_ROUGHNESSMAP
        totalEmissiveRadiance += vec3(0.28, 0.85, 1.0) * ormSample.b * uGlow;
        #endif`,
      );
    }
  };
  mat.customProgramCacheKey = () => (stone ? "runestone-stone" : "runestone-debris");
}

let debrisMaterial: THREE.MeshStandardMaterial | null = null;
function getDebrisMaterial() {
  if (!debrisMaterial) {
    debrisMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 });
    patchStoneShader(debrisMaterial, { bump: 0.9 });
  }
  return debrisMaterial;
}

function RuneStoneModel({ index, glow }: { index: number; glow: { current: number } }) {
  const tag = STONE_TAGS[index % STONE_TAGS.length];
  const { scene } = useGLTF(stoneUrl(tag));
  const [colorTex, normalTex, ormTex] = useTexture(texUrls(tag));
  const obj = useMemo(() => {
    // glTF UVs are not flipped, so the textures must not be either.
    const prep = (src: THREE.Texture, srgb: boolean) => {
      const t = src.clone();
      t.flipY = false;
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
      return t;
    };
    const orm = prep(ormTex, false);
    const stoneMat = new THREE.MeshStandardMaterial({
      map: prep(colorTex, true),
      normalMap: prep(normalTex, false),
      roughnessMap: orm,
      aoMap: orm,
      roughness: 1,
      metalness: 0,
    });
    patchStoneShader(stoneMat, { bump: 0.35, glow });
    const clone = scene.clone(true);
    clone.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      // the textured stone has UVs; the moss/rubble debris is vertex-coloured only
      m.material = m.geometry.attributes.uv ? stoneMat : getDebrisMaterial();
    });
    return clone;
  }, [scene, colorTex, normalTex, ormTex, glow]);
  return <primitive object={obj} position={[0, -STONE_SINK, 0]} />;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// 0 = dormant, 1 = fully awake. Wakes as you approach, dims (not off) once passed.
const revealFor = (t: number, s: number) =>
  smoothstep(t - 0.1, t - 0.01, s) *
  (1 - 0.75 * smoothstep(t + 0.04, t + 0.12, s));

function CameraRig() {
  const look = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, clock }, dt) => {
    const s = scrollState;
    s.smooth += (s.target - s.smooth) * (1 - Math.exp(-dt * 3));
    const u = Math.min(0.98, s.smooth);
    const pos = path.getPointAt(u);
    const ahead = path.getPointAt(Math.min(1, u + 6 / PATH_LEN));
    right.crossVectors(ahead.clone().sub(pos), UP).normalize();
    camera.position
      .copy(pos)
      .addScaledVector(right, s.mouseX * 0.5)
      .setY(1.7 + Math.sin(clock.elapsedTime * 0.8) * 0.06 + s.mouseY * 0.2);
    look.copy(ahead).setY(1.9 + s.mouseY * 0.3);
    camera.lookAt(look);
  });
  return null;
}

const runeVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const runeFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uReveal;
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    // Dissolve: noise decides which parts of the glyph appear first.
    float n = noise(vUv * 7.0) * 0.6 + noise(vUv * 18.0) * 0.4;
    float r = uReveal * 1.25;
    float mask = smoothstep(n, n + 0.04, r);
    float edge = smoothstep(n - 0.08, n, r) - mask;
    float pulse = 0.85 + 0.15 * sin(uTime * 2.0);
    vec3 col = tex.rgb * mask * 2.4 * pulse + vec3(0.5, 0.95, 1.0) * edge * 3.0;
    float a = tex.a * (mask + edge);
    gl_FragColor = vec4(col, a);
  }
`;

function RuneStation({ station, index }: { station: Station; index: number }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const sparkles = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const glow = useRef(0);

  const texture = useMemo(() => makeGlyphTexture(station.glyph), [station.glyph]);
  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uReveal: { value: 0 },
      uTime: { value: 0 },
    }),
    [texture],
  );

  // Place the monolith ahead of where the camera will stand, off to one side.
  const { position, target } = useMemo(() => {
    const stop = path.getPointAt(station.t);
    const ahead = path.getPointAt(Math.min(1, station.t + 7 / PATH_LEN));
    const right = new THREE.Vector3()
      .crossVectors(ahead.clone().sub(stop), UP)
      .normalize();
    const side = station.side === "left" ? -3.4 : station.side === "right" ? 3.4 : 0;
    return {
      position: ahead.clone().addScaledVector(right, side),
      target: stop.clone().setY(1.8),
    };
  }, [station]);

  useLayoutEffect(() => {
    group.current?.lookAt(target);
  }, [target]);

  useFrame(({ clock }) => {
    const r = revealFor(station.t, scrollState.smooth);
    if (mat.current) {
      mat.current.uniforms.uReveal.value = r;
      mat.current.uniforms.uTime.value = clock.elapsedTime;
    }
    glow.current = 0.08 + r * 2.2; // carved runes light up as the stone wakes
    if (light.current) light.current.intensity = r * 40;
    if (sparkles.current) sparkles.current.scale.setScalar(Math.max(0.001, r));
  });

  return (
    <group ref={group} position={position}>
      {/* carved stone from Blender (blender/runestone.py) */}
      <Suspense fallback={null}>
        <RuneStoneModel index={index} glow={glow} />
      </Suspense>
      {/* the rune, floating in the carved medallion */}
      <mesh position={[MEDALLION_X, MEDALLION_Y, 0.35]}>
        <planeGeometry args={[2.4, 2.4]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={runeVert}
          fragmentShader={runeFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <pointLight ref={light} position={[MEDALLION_X, MEDALLION_Y, 2.2]} color="#4fd3ff" distance={16} intensity={0} />
      <group ref={sparkles} position={[MEDALLION_X, MEDALLION_Y, 0.9]}>
        <Sparkles count={40} scale={[4, 5, 3]} size={4} speed={0.6} color="#9ff0ff" />
      </group>
    </group>
  );
}

function Stones() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 90;
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    const right = new THREE.Vector3();
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      const u = rnd() * 0.97;
      const p = path.getPointAt(u);
      const ahead = path.getPointAt(Math.min(1, u + 2 / PATH_LEN));
      right.crossVectors(ahead.clone().sub(p), UP).normalize();
      const off = (rnd() < 0.5 ? -1 : 1) * (4 + rnd() * 16);
      const sc = 0.4 + rnd() * rnd() * 3.2;
      dummy.position.copy(p).addScaledVector(right, off).setY(sc * 0.35);
      dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      dummy.scale.set(sc, sc * (0.6 + rnd()), sc);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#0b1124" roughness={1} flatShading />
    </instancedMesh>
  );
}

function Trail() {
  const geo = useMemo(() => new THREE.TubeGeometry(path, 400, 0.04, 6), []);
  return (
    <mesh geometry={geo} position={[0, 0.03, 0]}>
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.55} toneMapped={false} />
    </mesh>
  );
}

function Moon() {
  const end = path.getPointAt(1);
  return (
    <mesh position={[end.x + 10, 28, end.z - 60]}>
      <sphereGeometry args={[9, 48, 48]} />
      <meshBasicMaterial color="#d9efff" fog={false} toneMapped={false} />
    </mesh>
  );
}

function Fireflies() {
  const spots = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => path.getPointAt((i + 0.5) / 8)),
    [],
  );
  return (
    <>
      {spots.map((p, i) => (
        <Sparkles
          key={i}
          position={[p.x, 2, p.z - 10]}
          count={45}
          scale={[22, 5, 30]}
          size={3}
          speed={0.35}
          color="#a5f3fc"
        />
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 58, near: 0.1, far: 400, position: [0, 1.7, 0] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={[BG]} />
      <fogExp2 attach="fog" args={[BG, 0.028]} />
      <ambientLight intensity={0.6} color="#5a6aaa" />
      <directionalLight position={[10, 30, -40]} intensity={0.6} color="#9fc2ff" />

      <CameraRig />
      <Stars radius={150} depth={60} count={4000} factor={5} fade speed={0.6} />
      <Moon />

      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -80]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#060a1c" roughness={1} />
      </mesh>

      <Trail />
      <Stones />
      <Fireflies />
      {stations.map((s, i) => (
        <RuneStation key={s.id} station={s} index={i} />
      ))}

      <EffectComposer multisampling={0}>
        <Bloom intensity={1.1} luminanceThreshold={0.25} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
