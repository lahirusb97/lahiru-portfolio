import * as THREE from "three";
import { stations, type Station } from "./content";

// The winding path the tour camera follows (and the valley the explorer walks in).
export const path = new THREE.CatmullRomCurve3(
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
export const PATH_LEN = path.getLength();
export const UP = new THREE.Vector3(0, 1, 0);

// Where a station's stone stands: ahead of the stop point, off to one side, facing the stop.
export function placeStone(station: Station) {
  const stop = path.getPointAt(station.t);
  const ahead = path.getPointAt(Math.min(1, station.t + 7 / PATH_LEN));
  const right = new THREE.Vector3().crossVectors(ahead.clone().sub(stop), UP).normalize();
  const side = station.side === "left" ? -3.4 : station.side === "right" ? 3.4 : 0;
  const position = ahead.clone().addScaledVector(right, side);
  const target = stop.clone().setY(1.8);
  // Object3D.lookAt points local +Z at the target, so this is the stone's facing angle.
  const yaw = Math.atan2(target.x - position.x, target.z - position.z);
  return { position, target, yaw };
}

// Footprints of the stones, for walking collision (half extents in the stone's local frame).
export const stoneBoxes = stations.map((s) => {
  const { position, yaw } = placeStone(s);
  return { x: position.x, z: position.z, yaw, hw: 1.9, hd: 0.55 };
});

// Pre-sampled path for cheap "how far along the valley am I" queries.
const SAMPLES = 600;
const samples = Array.from({ length: SAMPLES + 1 }, (_, i) => path.getPointAt(i / SAMPLES));

export function nearestOnPath(x: number, z: number) {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i <= SAMPLES; i++) {
    const dx = samples[i].x - x;
    const dz = samples[i].z - z;
    const d = dx * dx + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return { u: best / SAMPLES, dist: Math.sqrt(bestD), point: samples[best] };
}
