"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { CharacterId } from "./content";
import { scrollState } from "./scroll";
import { nearestOnPath, path } from "./world";
import { treeTrunks } from "./Sakura";

// KayKit Adventurers 2.0 (CC0): the Mage plus the shared "Rig_Medium" animation clips.
const MAGE = "/models/character/mage.glb";
const ANIM_MOVE = "/models/character/anim_movement.glb";
const ANIM_GENERAL = "/models/character/anim_general.glb";
const MARIA = "/models/character/maria.glb"; // Mixamo character with Walk + Run clips
[MAGE, ANIM_MOVE, ANIM_GENERAL, MARIA].forEach((u) => useGLTF.preload(u));
const MARIA_HEIGHT = 1.75;

const WALK_SPEED = 2.4;
const RUN_SPEED = 5.2;
const BODY_RADIUS = 0.45; // keeps the walker out of the tree trunks
const MAX_FROM_PATH = 11; // soft edge: stay on the grass, out of the lake

const shortestAngle = (from: number, to: number) => {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};

const makeState = () => ({
  pos: new THREE.Vector3(),
  face: Math.PI,
  camYaw: Math.PI,
  camPitch: 0.32,
  camDist: 4.6,
  speed: 0,
  run: false,
  camPos: new THREE.Vector3(),
  camInit: false,
  dir: new THREE.Vector3(),
  desired: new THREE.Vector3(),
});

type State = ReturnType<typeof makeState>;
type ClipNames = {
  idle?: string;
  walk: string;
  run: string;
  walkSpeed?: number; // ground speed the clip was authored at, m/s, to stop feet sliding
  runSpeed?: number;
};

const setTimeScale = (action: THREE.AnimationAction, v: number) => {
  action.timeScale = v;
};

// Mixamo clips can carry root motion: the hips travel forward every loop, so the body slides
// away from where the game places it and then snaps back. Flatten the axis the hips travel
// along (the one with the biggest range) and keep the bob and sway.
function stripRootMotion(src: THREE.AnimationClip) {
  const clip = src.clone();
  clip.tracks.forEach((tr) => {
    if (!tr.name.endsWith("Hips.position")) return;
    const v = tr.values;
    const n = v.length / 3;
    let best = 0;
    let bestRange = 0;
    for (let a = 0; a < 3; a++) {
      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 0; i < n; i++) {
        lo = Math.min(lo, v[i * 3 + a]);
        hi = Math.max(hi, v[i * 3 + a]);
      }
      if (hi - lo > bestRange) {
        bestRange = hi - lo;
        best = a;
      }
    }
    if (bestRange > 20) {
      const first = v[best];
      for (let i = 0; i < n; i++) v[i * 3 + best] = first;
    }
  });
  return clip;
}

const freezeOnPassingPose = (action: THREE.AnimationAction) => {
  action.time = action.getClip().duration * 0.25;
  action.paused = true;
};

// Cross-fades idle / walk / run from the explorer's speed. If a character has no idle clip,
// the walk clip is frozen on its passing pose as a stand-in.
function useCrossfade(
  actions: Record<string, THREE.AnimationAction | null>,
  stRef: React.RefObject<State>,
  names: ClipNames,
) {
  const current = useRef("");
  useFrame(() => {
    const st = stRef.current;
    const moving = st.speed > 0.35;
    const want = moving ? (st.run ? names.run : names.walk) : (names.idle ?? "__idle_fallback");
    // match the playback rate to how fast the explorer is really moving
    const natural = st.run ? names.runSpeed : names.walkSpeed;
    if (moving && natural && actions[want]) {
      setTimeScale(actions[want]!, THREE.MathUtils.clamp(st.speed / natural, 0.6, 1.8));
    }
    if (want === current.current) return;
    const key = want === "__idle_fallback" ? names.walk : want;
    const next = actions[key];
    if (!next) return;
    const prevKey = current.current === "__idle_fallback" ? names.walk : current.current;
    const prev = prevKey ? actions[prevKey] : null;
    next.reset().fadeIn(0.25).play();
    if (want === "__idle_fallback") freezeOnPassingPose(next);
    if (prev && prev !== next) prev.fadeOut(0.25);
    current.current = want;
  });
}

function MageModel({ stRef }: { stRef: React.RefObject<State> }) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MAGE);
  const moveGltf = useGLTF(ANIM_MOVE);
  const generalGltf = useGLTF(ANIM_GENERAL);
  const clips = useMemo(
    () => [...moveGltf.animations, ...generalGltf.animations],
    [moveGltf.animations, generalGltf.animations],
  );
  const { actions } = useAnimations(clips, root);
  useEffect(() => {
    scene.traverse((o) => {
      o.frustumCulled = false; // skinned meshes must not pop out near the screen edge
      o.castShadow = true;
    });
  }, [scene]);
  useCrossfade(actions, stRef, { idle: "Idle_A", walk: "Walking_A", run: "Running_B" });
  return (
    <group ref={root}>
      <primitive object={scene} />
    </group>
  );
}

function MariaModel({ stRef }: { stRef: React.RefObject<State> }) {
  const root = useRef<THREE.Group>(null);
  const fit = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MARIA);
  const clips = useMemo(() => animations.map(stripRootMotion), [animations]);
  const { actions } = useAnimations(clips, root);

  // Mixamo exports are in odd units: measure the skinned mesh and scale to a real height,
  // with the feet on the ground.
  useEffect(() => {
    scene.traverse((o) => {
      o.frustumCulled = false;
      o.castShadow = true;
    });
    scene.updateMatrixWorld(true);
    let skinned: THREE.SkinnedMesh | null = null;
    scene.traverse((o) => {
      if (!skinned && (o as THREE.SkinnedMesh).isSkinnedMesh) skinned = o as THREE.SkinnedMesh;
    });
    if (skinned && fit.current) {
      const box = new THREE.Box3().setFromObject(skinned, true);
      const h = box.max.y - box.min.y;
      if (h > 0.01) {
        const k = MARIA_HEIGHT / h;
        fit.current.scale.setScalar(k);
        fit.current.position.y = -box.min.y * k;
      }
    }
  }, [scene]);

  useCrossfade(actions, stRef, { walk: "Walk", run: "Run", walkSpeed: 1.6, runSpeed: 5.5 });
  return (
    <group ref={root}>
      <group ref={fit}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// Third-person walking: arrows / WASD to move, Shift to run, drag to look, wheel to zoom.
// Progress along the valley is mirrored into scrollState.smooth.
export default function Explorer({ character }: { character: CharacterId }) {
  const group = useRef<THREE.Group>(null);
  const model = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);

  const keys = useRef(new Set<string>());
  const drag = useRef({ on: false, x: 0, y: 0 });
  const stRef = useRef(makeState());

  // Start where the tour camera was, facing down the valley.
  useEffect(() => {
    const st = stRef.current;
    const u = Math.min(0.97, Math.max(0, scrollState.smooth));
    st.pos.copy(path.getPointAt(u));
    const tan = path.getTangentAt(u);
    st.face = Math.atan2(tan.x, tan.z);
    st.camYaw = st.face;
    st.pos.z -= 3; st.camYaw -= 0.55; st.camPitch = 0.12; st.camDist = 4.5; // TEMP-SHOT
  }, []);

  // Input
  useEffect(() => {
    const st = stRef.current;
    const k = keys.current;
    const block = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);
    const down = (e: KeyboardEvent) => {
      if (block.has(e.code)) e.preventDefault();
      k.add(e.code);
    };
    const up = (e: KeyboardEvent) => k.delete(e.code);
    const blur = () => k.clear();
    const el = gl.domElement;
    const pDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag.current = { on: true, x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const pMove = (e: PointerEvent) => {
      if (!drag.current.on) return;
      st.camYaw += (e.clientX - drag.current.x) * 0.005;
      st.camPitch = Math.min(1.1, Math.max(-0.15, st.camPitch + (e.clientY - drag.current.y) * 0.004));
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
    };
    const pUp = (e: PointerEvent) => {
      drag.current.on = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const wheel = (e: WheelEvent) => {
      st.camDist = Math.min(8, Math.max(2.4, st.camDist + e.deltaY * 0.004));
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    el.addEventListener("pointerdown", pDown);
    el.addEventListener("pointermove", pMove);
    el.addEventListener("pointerup", pUp);
    el.addEventListener("wheel", wheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      el.removeEventListener("pointerdown", pDown);
      el.removeEventListener("pointermove", pMove);
      el.removeEventListener("pointerup", pUp);
      el.removeEventListener("wheel", wheel);
    };
  }, [gl]);

  useFrame(({ camera }, rawDt) => {
    const st = stRef.current;
    const dt = Math.min(rawDt, 0.05);
    const k = keys.current;
    const fwd = (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) - (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0);
    const str = (k.has("KeyD") || k.has("ArrowRight") ? 1 : 0) - (k.has("KeyA") || k.has("ArrowLeft") ? 1 : 0);
    const run = k.has("ShiftLeft") || k.has("ShiftRight");

    // movement is relative to where the camera looks
    const sy = Math.sin(st.camYaw);
    const cy = Math.cos(st.camYaw);
    st.dir.set(sy * fwd - cy * str, 0, cy * fwd + sy * str);
    const moving = st.dir.lengthSq() > 0;
    if (moving) st.dir.normalize();
    const targetSpeed = moving ? (run ? RUN_SPEED : WALK_SPEED) : 0;
    st.speed += (targetSpeed - st.speed) * (1 - Math.exp(-dt * 10));
    if (moving) {
      st.pos.addScaledVector(st.dir, st.speed * dt);
      st.face += shortestAngle(st.face, Math.atan2(st.dir.x, st.dir.z)) * (1 - Math.exp(-dt * 12));
    }

    // walk around the cherry trunks
    for (const t of treeTrunks) {
      const dx = st.pos.x - t.x;
      const dz = st.pos.z - t.z;
      const min = t.r + BODY_RADIUS;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min && d2 > 1e-6) {
        const k2 = min / Math.sqrt(d2);
        st.pos.x = t.x + dx * k2;
        st.pos.z = t.z + dz * k2;
      }
    }

    // soft walls: stay within the valley, and report progress to the rest of the scene
    const near = nearestOnPath(st.pos.x, st.pos.z);
    if (near.dist > MAX_FROM_PATH) {
      const k2 = MAX_FROM_PATH / near.dist;
      st.pos.x = near.point.x + (st.pos.x - near.point.x) * k2;
      st.pos.z = near.point.z + (st.pos.z - near.point.z) * k2;
    }
    scrollState.smooth += (near.u - scrollState.smooth) * (1 - Math.exp(-dt * 6));
    scrollState.target = scrollState.smooth;

    if (group.current) group.current.position.copy(st.pos);
    if (model.current) model.current.rotation.y = st.face;

    st.run = run;

    // follow camera
    const cp = Math.cos(st.camPitch);
    st.desired.set(
      st.pos.x - Math.sin(st.camYaw) * cp * st.camDist,
      Math.max(0.4, st.pos.y + 1.5 + Math.sin(st.camPitch) * st.camDist),
      st.pos.z - Math.cos(st.camYaw) * cp * st.camDist,
    );
    if (!st.camInit) {
      st.camPos.copy(st.desired); // start behind the walker, not inside them
      st.camInit = true;
    }
    st.camPos.lerp(st.desired, 1 - Math.exp(-dt * 9));
    camera.position.copy(st.camPos);
    camera.lookAt(st.pos.x, st.pos.y + 1.35, st.pos.z);
  });

  return (
    <group ref={group}>
      <group ref={model}>
        {character === "maria" ? <MariaModel stRef={stRef} /> : <MageModel stRef={stRef} />}
      </group>
    </group>
  );
}
