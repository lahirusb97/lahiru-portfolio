import * as THREE from "three";

type Seg = [number, number][];

// Hand-drawn rune strokes in a 0..1 box, so no runic font is required.
const GLYPHS: Seg[][] = [
  // Fehu
  [[[0.45, 0.1], [0.45, 0.9]], [[0.45, 0.4], [0.75, 0.2]], [[0.45, 0.65], [0.75, 0.45]]],
  // Uruz
  [[[0.3, 0.9], [0.3, 0.1], [0.7, 0.3], [0.7, 0.9]]],
  // Thurisaz
  [[[0.4, 0.1], [0.4, 0.9]], [[0.4, 0.3], [0.7, 0.5], [0.4, 0.7]]],
  // Ansuz
  [[[0.4, 0.1], [0.4, 0.9]], [[0.4, 0.1], [0.72, 0.3]], [[0.4, 0.38], [0.72, 0.58]]],
  // Raido
  [[[0.35, 0.1], [0.35, 0.9]], [[0.35, 0.1], [0.7, 0.3], [0.35, 0.5], [0.72, 0.9]]],
  // Othala
  [[[0.5, 0.1], [0.75, 0.35], [0.5, 0.6], [0.25, 0.35], [0.5, 0.1]], [[0.5, 0.6], [0.25, 0.9]], [[0.5, 0.6], [0.75, 0.9]]],
  // Gebo (spare)
  [[[0.25, 0.15], [0.75, 0.85]], [[0.75, 0.15], [0.25, 0.85]]],
];

export function makeGlyphTexture(index: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const stroke = (width: number, color: string, blur: number) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    for (const seg of GLYPHS[index % GLYPHS.length]) {
      ctx.beginPath();
      seg.forEach(([x, y], i) => {
        const px = 90 + x * (size - 180);
        const py = 90 + y * (size - 180);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  };

  // Outer circle
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#7fe9ff";
  ctx.shadowColor = "#7fe9ff";
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 28, 0, Math.PI * 2);
  ctx.stroke();

  stroke(22, "#38bdf8", 40); // soft glow
  stroke(10, "#e0faff", 12); // bright core

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
