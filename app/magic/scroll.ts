// Shared scroll state read by both the 3D scene (every frame) and the DOM overlay.
export const scrollState = {
  target: 0, // raw 0..1 page progress
  smooth: 0, // eased value the camera follows
  mouseX: 0,
  mouseY: 0,
  // Screen-space position (CSS px) of each station's medallion, written by the 3D scene
  // every frame so the DOM overlay can make text emerge from the rune.
  runes: Array.from({ length: 12 }, () => ({ x: 0, y: 0, r: 0, on: false })),
};

export function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollState.target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}
