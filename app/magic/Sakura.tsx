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
    addWind(tm, 0.004, windTime);
    const fm = petalMaterial();
    addWind(fm, 0.012, windTime);
    const lm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide });
    addWind(lm, 0.012, windTime);
    return {
      trunkGeo: trunk.geometry,
      trunkMat: tm,
      kindGeo: KINDS.map((k) => nodes[MESH_FOR[k]].geometry),
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
    KINDS.forEach((_, k) => {
      const mesh = refs.current[k];
      if (!mesh) return;
      const arr = new Float32Array(buffers[k]);
      let i = 0;
      for (const p of placements) {
        for (let j = 0; j < counts[k]; j++) {
          local.fromArray(arr, j * 16);
          mesh.setMatrixAt(i++, out.multiplyMatrices(p, local));
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
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

  return <instancedMesh ref={ref} args={[nodes.WEB_Petal.geometry, mat, count]} frustumCulled={false} />;
}
