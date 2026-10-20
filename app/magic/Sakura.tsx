"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { PATH_LEN, UP, path } from "./world";

// Cherry tree built in Blender (blender/blossom_tree.blend): a bark-textured trunk plus
// low-poly flower meshes. Each flower's transform is baked to a float32 4x4 (column-major,
// Y-up) per kind, so a whole tree's blossoms render as a handful of instanced draws.
const BASE = "/models/sakura";
const TREE_URL = `${BASE}/sakura_tree.glb`;
const KINDS = ["full", "half", "bud", "leaf", "petal"] as const;
type Kind = (typeof KINDS)[number];
const MESH_FOR: Record<Kind, string> = {
  full: "WEB_Full",
  half: "WEB_Half",
  bud: "WEB_Bud",
  leaf: "WEB_Leaf",
  petal: "WEB_Petal",
};
const INST_URLS = KINDS.map((k) => `${BASE}/inst_${k}.bin`);
useGLTF.preload(TREE_URL);

const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Where the trees stand: alternating sides of the valley, clear of the path.
export const treeSpots = (() => {
  const rnd = mulberry32(1903);
  const right = new THREE.Vector3();
  const out: { x: number; z: number; yaw: number; scale: number }[] = [];
  for (let i = 0; i < 9; i++) {
    const u = Math.min(0.97, (i + 0.35 + rnd() * 0.3) / 9);
    const p = path.getPointAt(u);
    const ahead = path.getPointAt(Math.min(1, u + 2 / PATH_LEN));
    right.crossVectors(ahead.clone().sub(p), UP).normalize();
    const side = i % 2 === 0 ? 1 : -1;
    const pos = p.clone().addScaledVector(right, side * (6 + rnd() * 4));
    out.push({ x: pos.x, z: pos.z, yaw: rnd() * Math.PI * 2, scale: 0.85 + rnd() * 0.3 });
  }
  return out;
})();

// Footprints for walking collision.
export const treeTrunks = treeSpots.map((t) => ({ x: t.x, z: t.z, r: 0.45 * t.scale }));

// Classic sakura pink: a deep rose eye, pink through the petal, softening to pale blush at
// the tips. Colours are linear (vertex colours aren't gamma-decoded).
const SAKURA = {
  eye: new THREE.Color(0.55, 0.05, 0.16),
  mid: new THREE.Color(0.96, 0.33, 0.47),
  edge: new THREE.Color(1.0, 0.6, 0.7),
  bud: new THREE.Color(0.78, 0.12, 0.3),
  budTip: new THREE.Color(0.95, 0.32, 0.48),
};

// Repaint a flower mesh from the centre outward (petals run ~0 -> 1 from the middle).
function paintPetals(src: THREE.BufferGeometry, inner: THREE.Color, mid: THREE.Color, outer: THREE.Color) {
  const g = src.clone();
  const pos = g.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const r = Math.min(1, Math.hypot(pos.getX(i), pos.getY(i), pos.getZ(i)));
    if (r < 0.3) c.lerpColors(inner, mid, THREE.MathUtils.smoothstep(r, 0.0, 0.3));
    else c.lerpColors(mid, outer, THREE.MathUtils.smoothstep(r, 0.3, 0.95));
    c.toArray(col, i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return g;
}

// A young sakura leaf: pointed oval, folded up along the midrib and drooping toward the tip,
// with a finely toothed edge. Fresh green with a bronze flush, as sakura leaves open with the
// blossom. Length runs along +x (0..1), the blade faces +y, matching the baked leaf frame.
function makeLeaf() {
  const NU = 12;
  const NV = 7;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const green = new THREE.Color(0.1, 0.27, 0.04);
  const bronze = new THREE.Color(0.32, 0.15, 0.05);
  const c = new THREE.Color();
  for (let i = 0; i < NU; i++) {
    const u = i / (NU - 1);
    const half = 0.2 * Math.sin(Math.PI * Math.pow(u, 0.75)) * (1 - 0.15 * u);
    for (let j = 0; j < NV; j++) {
      const v = -1 + (2 * j) / (NV - 1);
      const edge = Math.abs(v) === 1;
      const tooth = edge && i % 2 === 1 ? 1.07 : 1;
      const z = v * half * tooth;
      const y = 0.25 * Math.abs(z) - 0.12 * u * u; // midrib fold + droop
      pos.push(u, y, z);
      const vein = 1 - 0.18 * Math.exp(-Math.pow(v / 0.12, 2)); // paler midrib
      c.lerpColors(green, bronze, 0.55 * THREE.MathUtils.smoothstep(u, 0.45, 1) + 0.25 * Math.abs(v));
      col.push(c.r / vein, c.g / vein, c.b / vein);
    }
  }
  for (let i = 0; i < NU - 1; i++)
    for (let j = 0; j < NV - 1; j++) {
      const a = i * NV + j;
      idx.push(a, a + NV, a + 1, a + 1, a + NV, a + NV + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function petalMaterial() {
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.55,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  // Thin petals glow when the sun is behind them: add a little light through the back face.
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      /* glsl */ `#include <emissivemap_fragment>
      totalEmissiveRadiance += diffuseColor.rgb * 0.18;`,
    );
  };
  return mat;
}

// One clock shared by every swaying material.
const windTime = { value: 0 };

// Sway the canopy slightly in the wind:an offset that grows with height, applied after the
// instance transform so each flower's own scale and spin don't distort it.
function addWind(mat: THREE.Material, amount: number, time: { value: number }) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, r) => {
    prev?.call(mat, shader, r);
    shader.uniforms.uTime = time;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;")
      .replace(
        "#include <project_vertex>",
        /* glsl */ `vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
        #endif
        vec3 wp = (modelMatrix * mvPosition).xyz;
        float h = max(0.0, wp.y - 1.5);
        float sway = sin(uTime * 1.3 + wp.x * 0.7 + wp.z * 0.5) * 0.5 + sin(uTime * 2.7 + wp.y) * 0.25;
        mvPosition.xyz += vec3(sway, 0.0, sway * 0.6) * h * ${amount.toFixed(4)};
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;`,
      );
  };
  mat.customProgramCacheKey = () => `sakura-wind-${amount}`;
}

export function SakuraTrees() {
  const { nodes } = useGLTF(TREE_URL) as unknown as { nodes: Record<string, THREE.Mesh> };
  const buffers = useLoader(THREE.FileLoader, INST_URLS, (l) => l.setResponseType("arraybuffer")) as ArrayBuffer[];
  const refs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const trunkRef = useRef<THREE.InstancedMesh>(null);

  const { trunkGeo, trunkMat, kindGeo, flowerMat, leafMat, counts } = useMemo(() => {
    const trunk = nodes.WEB_Trunk;
    const tm = (trunk.material as THREE.MeshStandardMaterial).clone();
    tm.envMapIntensity = 0.8;
    tm.color.setRGB(0.62, 0.52, 0.5); // darker, red-grey sakura bark
    addWind(tm, 0.004, windTime);
    const fm = petalMaterial();
    addWind(fm, 0.012, windTime);
    const lm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, side: THREE.DoubleSide });
    addWind(lm, 0.012, windTime);
    return {
      trunkGeo: trunk.geometry,
      trunkMat: tm,
      kindGeo: KINDS.map((k) => {
        const g = nodes[MESH_FOR[k]].geometry;
        if (k === "leaf") return makeLeaf();
        if (k === "bud") return paintPetals(g, SAKURA.bud, SAKURA.bud, SAKURA.budTip);
        if (k === "petal") return paintPetals(g, SAKURA.mid, SAKURA.mid, SAKURA.edge);
        return paintPetals(g, SAKURA.eye, SAKURA.mid, SAKURA.edge);
      }),
      flowerMat: fm,
      leafMat: lm,
      counts: buffers.map((b) => b.byteLength / 64),
    };
  }, [nodes, buffers]);

  useLayoutEffect(() => {
    const place = new THREE.Matrix4();
    const local = new THREE.Matrix4();
    const out = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const placements = treeSpots.map((t) =>
      place.clone().compose(
        new THREE.Vector3(t.x, 0, t.z),
        q.setFromAxisAngle(UP, t.yaw).clone(),
        new THREE.Vector3(t.scale, t.scale, t.scale),
      ),
    );
    const BLOOM = new THREE.Vector3(1.35, 1.35, 1.35);
    // Each flower gets a slight tint, so some clusters read pinker and some paler.
    const rnd = mulberry32(31);
    const tint = new THREE.Color();
    KINDS.forEach((kind, k) => {
      const mesh = refs.current[k];
      if (!mesh) return;
      const arr = new Float32Array(buffers[k]);
      let i = 0;
      for (const p of placements) {
        for (let j = 0; j < counts[k]; j++) {
          local.fromArray(arr, j * 16);
          if (kind === "full" || kind === "half" || kind === "bud") local.scale(BLOOM); // fuller canopy
          const r = rnd();
          if (kind === "leaf") tint.setRGB(0.85 + 0.3 * r, 0.9 + 0.2 * r, 0.8 + 0.25 * rnd());
          else tint.setRGB(1, 0.84 + 0.16 * r, 0.88 + 0.12 * r);
          mesh.setColorAt(i, tint);
          mesh.setMatrixAt(i++, out.multiplyMatrices(p, local));
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
    const tr = trunkRef.current;
    if (tr) {
      placements.forEach((p, i) => tr.setMatrixAt(i, p));
      tr.instanceMatrix.needsUpdate = true;
      tr.computeBoundingSphere();
    }
  }, [buffers, counts]);

  useFrame(({ clock }) => {
    windTime.value = clock.elapsedTime;
  });

  const n = treeSpots.length;
  return (
    <group>
      <instancedMesh ref={trunkRef} args={[trunkGeo, trunkMat, n]} castShadow receiveShadow />
      {KINDS.map((k, i) => (
        <instancedMesh
          key={k}
          ref={(el) => {
            refs.current[i] = el;
          }}
          args={[kindGeo[i], k === "leaf" ? leafMat : flowerMat, counts[i] * n]}
          castShadow={k === "full"}
          receiveShadow
        />
      ))}
    </group>
  );
}

// Petals drifting on the wind in a box that follows the camera, so they're always around you.
export function FallingPetals({ count = 500 }: { count?: number }) {
  const { nodes } = useGLTF(TREE_URL) as unknown as { nodes: Record<string, THREE.Mesh> };
  const ref = useRef<THREE.InstancedMesh>(null);
  const mat = useMemo(() => petalMaterial(), []);
  const geo = useMemo(() => paintPetals(nodes.WEB_Petal.geometry, SAKURA.mid, SAKURA.mid, SAKURA.edge), [nodes]);
  const seeds = useMemo(() => {
    const rnd = mulberry32(77);
    return Array.from({ length: count }, () => ({
      x: rnd(), y: rnd(), z: rnd(),
      fall: 0.35 + rnd() * 0.45,
      spin: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
      rate: 1 + rnd() * 3,
      ph: rnd() * 6.28,
      s: 0.05 + rnd() * 0.035,
    }));
  }, [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const BOX = [36, 12, 36];
  const WIND = new THREE.Vector3(0.9, 0, 0.45);

  useFrame(({ clock, camera }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const wrap = (v: number, c: number, size: number) => c + ((((v - c) % size) + size * 1.5) % size) - size / 2;
    seeds.forEach((s, i) => {
      const x = s.x * BOX[0] + WIND.x * t * s.fall + Math.sin(t * 0.8 + s.ph) * 0.6;
      const y = s.y * BOX[1] - t * s.fall;
      const z = s.z * BOX[2] + WIND.z * t * s.fall + Math.cos(t * 0.6 + s.ph) * 0.6;
      dummy.position.set(
        wrap(x, camera.position.x, BOX[0]),
        ((y % BOX[1]) + BOX[1]) % BOX[1] + 0.05,
        wrap(z, camera.position.z, BOX[2]),
      );
      dummy.quaternion.setFromAxisAngle(s.spin, t * s.rate + s.ph);
      dummy.scale.setScalar(s.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, mat, count]} frustumCulled={false} />;
}
