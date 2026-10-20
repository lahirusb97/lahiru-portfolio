"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { CharacterId } from "./content";
import { PATH_LEN, UP, path } from "./world";
import Explorer from "./Explorer";
import { FallingPetals, SakuraTrees } from "./Sakura";
import { Lake, Land } from "./Lake";

// Spring daylight: a park HDRI (Poly Haven "je_gray_park", CC0) lights the scene, and the
// fog matches its hazy horizon so the valley fades into the sky.
const FOG = "#a3ada8";
const HDRI = "/models/sakura/park_1k.hdr";
const SKY = "/models/sakura/park_bg.jpg";
useTexture.preload(SKY);

// A worn earth path along the valley: a flat ribbon whose edges fade into the grass.
function DirtPath() {
  const geo = useMemo(() => {
    const N = 400;
    const W = 1.3;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const right = new THREE.Vector3();
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const p = path.getPointAt(u);
      right.crossVectors(path.getTangentAt(u), UP).normalize();
      for (const s of [-1, 1]) {
        pos.push(p.x + right.x * W * s, 0.02, p.z + right.z * W * s);
        uv.push((s + 1) / 2, u * PATH_LEN * 0.5);
      }
      if (i < N) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);
  const alpha = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 1;
    const ctx = c.getContext("2d")!;
    const gr = ctx.createLinearGradient(0, 0, 64, 0);
    gr.addColorStop(0, "#000");
    gr.addColorStop(0.3, "#fff");
    gr.addColorStop(0.7, "#fff");
    gr.addColorStop(1, "#000");
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, 64, 1);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color="#9a8264" roughness={1} alphaMap={alpha} transparent depthWrite={false} />
    </mesh>
  );
}

function SkyBackdrop() {
  const tex = useTexture(SKY, (t) => {
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
  });
  return <primitive attach="background" object={tex} />;
}

// The sun casts shadows in a box that follows the camera, so a small shadow map stays sharp
// all the way down the valley.
const SUN_DIR = new THREE.Vector3(-0.45, 0.75, 0.5).normalize();
function Sun() {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame(({ camera }) => {
    const l = light.current;
    if (!l) return;
    const fwd = camera.getWorldDirection(new THREE.Vector3()).setY(0).normalize();
    const c = camera.position.clone().addScaledVector(fwd, 12).setY(0);
    l.target.position.copy(c);
    l.position.copy(c).addScaledVector(SUN_DIR, 60);
    l.target.updateMatrixWorld();
  });
  return (
    <directionalLight
      ref={light}
      intensity={2.6}
      color="#fff4e2"
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-left={-22}
      shadow-camera-right={22}
      shadow-camera-top={22}
      shadow-camera-bottom={-22}
      shadow-camera-near={1}
      shadow-camera-far={120}
    />
  );
}

export default function Scene({ character }: { character: CharacterId }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: 58, near: 0.1, far: 400, position: [0, 1.7, 0] }}
      gl={{ antialias: true, powerPreference: "high-performance", toneMappingExposure: 0.9 }}
    >
      <color attach="background" args={[FOG]} />
      <fogExp2 attach="fog" args={[FOG, 0.009]} />
      <Suspense fallback={null}>
        <Environment files={HDRI} environmentIntensity={0.9} />
        <SkyBackdrop />
      </Suspense>
      <hemisphereLight args={["#dfe9f5", "#5d6b3a", 0.35]} />
      <Sun />

      <Suspense fallback={null}>
        <Explorer character={character} />
      </Suspense>

      <Suspense fallback={null}>
        <Land />
      </Suspense>
      <Lake sunDirection={SUN_DIR} />
      <DirtPath />
      <Suspense fallback={null}>
        <SakuraTrees />
        <FallingPetals count={300} />
      </Suspense>
    </Canvas>
  );
}
