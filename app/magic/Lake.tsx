"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { PATH_LEN, path } from "./world";

const GRASS = ["diff", "nor_gl", "rough"].map((m) => `/models/sakura/grass_${m}_1k.jpg`);
useTexture.preload(GRASS);

export const WATER_Y = -0.14;
const SHORE = 3; // metres of bank sloping down into the water
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

// Grassy strip the path runs along. Its edges slope under the water, and the grass darkens
// to wet earth near the waterline.
export function Land() {
  const [diff, nor, rough] = useTexture(GRASS, (texs) => {
    texs.forEach((t, i) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      t.colorSpace = i === 0 ? THREE.SRGBColorSpace : THREE.NoColorSpace;
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
        const wet = 1 - 0.55 * smoothstep(inner - 1.2, inner + 0.6, ad);
        col.push(wet, wet * 0.97, wet * 0.9);
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
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial
        map={diff}
        normalMap={nor}
        roughnessMap={rough}
        vertexColors
        color="#c9d6b0"
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

// Tileable ripple normal map, built from a sum of waves with whole-number frequencies so it
// wraps seamlessly.
function makeWaterNormals(size = 256) {
  let seed = 12345;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const waves = Array.from({ length: 28 }, () => {
    const kx = Math.round((rnd() - 0.5) * 24);
    const ky = Math.round((rnd() - 0.5) * 24);
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

// Ripple clock, shared with the water shader.
const lakeTime = { value: 0 };

// A calm lake: planar reflection of the trees and sky, Fresnel, sun glints and slow ripples.
export function Lake({ sunDirection }: { sunDirection: THREE.Vector3 }) {
  const water = useMemo(() => {
    const w = new Water(new THREE.PlaneGeometry(900, 900), {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: makeWaterNormals(),
      sunDirection: sunDirection.clone(),
      sunColor: 0xfff4e2,
      waterColor: 0x23474a,
      distortionScale: 0.9,
      fog: true,
    });
    w.rotation.x = -Math.PI / 2;
    w.position.set(0, WATER_Y, -80);
    const u = (w.material as THREE.ShaderMaterial).uniforms;
    u.size.value = 6;
    u.time = lakeTime;
    return w;
  }, [sunDirection]);

  useFrame((_, dt) => {
    lakeTime.value += dt * 0.35;
  });

  return <primitive object={water} />;
}
