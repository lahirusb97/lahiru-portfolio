// Shared scroll state read by both the 3D scene (every frame) and the DOM overlay.
export const scrollState = {
  target: 0, // raw 0..1 page progress
  smooth: 0, // eased value the camera follows
  mouseX: 0,
  mouseY: 0,
};

export function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollState.target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}
