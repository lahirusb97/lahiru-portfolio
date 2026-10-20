import * as THREE from "three";

type Seg = [number, number][];

// Hand-drawn rune strokes in a 0..1 box, so no runic font is required.
export const GLYPHS: Seg[][] = [
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

  stroke(22, "#38bdf8", 40); // soft glow
  stroke(10, "#e0faff", 12); // bright core

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Concentric ring textures for the medallion lock. Drawn for a plane whose half-size is
// 1.18 world units (the carved recess radius), so radii below are in world units * PPU.
const PPU = 512 / 1.18;

export function makeRingTexture(kind: number): THREE.CanvasTexture {
  const size = 1024;
  const c = size / 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const circle = (r: number, lw: number) => {
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.stroke();
  };
  const polar = (r: number, a: number): [number, number] => [c + r * Math.cos(a), c + r * Math.sin(a)];

  const draw = (lw: number) => {
    if (kind === 0) {
      // outer band of runes
      circle(1.16 * PPU, lw * 0.7);
      circle(1.04 * PPU, lw * 0.7);
      const n = 24;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        const [x, y] = polar(1.1 * PPU, a);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a + Math.PI / 2);
        for (const stroke of GLYPHS[(k * 3 + 1) % GLYPHS.length]) {
          ctx.beginPath();
          stroke.forEach(([u, v], i) => {
            const px = (u - 0.5) * 34;
            const py = (v - 0.5) * 50;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.lineWidth = lw * 0.8;
          ctx.stroke();
        }
        ctx.restore();
      }
    } else if (kind === 1) {
      // tick band with triangle markers
      circle(1.0 * PPU, lw * 0.7);
      circle(0.88 * PPU, lw * 0.7);
      for (let k = 0; k < 36; k++) {
        const a = (k / 36) * Math.PI * 2;
        const long = k % 3 === 0;
        const [x0, y0] = polar((long ? 0.9 : 0.93) * PPU, a);
        const [x1, y1] = polar((long ? 0.98 : 0.96) * PPU, a);
        ctx.lineWidth = lw * (long ? 0.9 : 0.6);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
        const pts = [polar(0.905 * PPU, a - 0.05), polar(0.905 * PPU, a + 0.05), polar(0.985 * PPU, a)];
        ctx.lineWidth = lw * 0.8;
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.closePath();
        ctx.stroke();
      }
    } else {
      // inner orbit arcs with gem dots
      const r = 0.81 * PPU;
      const arcs: [number, number][] = [[0, 100], [120, 225], [245, 335]];
      ctx.lineWidth = lw * 1.3;
      for (const [a0, a1] of arcs) {
        ctx.beginPath();
        ctx.arc(c, c, r, (a0 * Math.PI) / 180, (a1 * Math.PI) / 180);
        ctx.stroke();
        for (const a of [a0, a1]) {
          const [x, y] = polar(r, (a * Math.PI) / 180);
          ctx.beginPath();
          ctx.arc(x, y, lw * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.setLineDash([5, 11]);
      circle(0.75 * PPU, lw * 0.6);
      ctx.setLineDash([]);
    }
  };

  // soft glow pass, then a bright core pass
  ctx.strokeStyle = ctx.fillStyle = "#38bdf8";
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 26;
  draw(9);
  ctx.strokeStyle = ctx.fillStyle = "#e6fbff";
  ctx.shadowColor = "#7fe9ff";
  ctx.shadowBlur = 8;
  draw(3.5);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Soft, cloudy smoke puff (white with fbm-driven alpha and a radial falloff). Tinted per-sprite.
export function makeSmokeTexture(seed: number): THREE.CanvasTexture {
  const n = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = n;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(n, n);

  const hash = (x: number, y: number) => {
    const v = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const vnoise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x: number, y: number) => {
    let amp = 0.5, f = 1, sum = 0;
    for (let i = 0; i < 5; i++) {
      sum += amp * vnoise(x * f, y * f);
      amp *= 0.5;
      f *= 2;
    }
    return sum;
  };

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const dx = (x / n) * 2 - 1, dy = (y / n) * 2 - 1;
      const d = Math.hypot(dx, dy);
      const t = Math.min(1, Math.max(0, (d - 0.3) / 0.7));
      const fall = 1 - t * t * (3 - 2 * t);
      const a = Math.min(1, Math.max(0, (fbm(x * 0.028, y * 0.028) - 0.28) * 2.0)) * fall;
      const i = (y * n + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
