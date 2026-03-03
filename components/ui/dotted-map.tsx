"use client";

import DottedMapLib from "dotted-map";

interface Dot {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

interface DottedMapProps {
  dots?: Dot[];
  lineColor?: string;
  dotColor?: string;
  className?: string;
}

// SVG coordinate space produced by height:60, grid:"diagonal"
const SVG_W = 119;
const SVG_H = 60;

function project(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * SVG_W;
  const y = ((90 - lat) / 180) * SVG_H;
  return { x, y };
}

export function DottedMap({
  dots = [],
  lineColor = "rgba(99,102,241,0.6)",
  dotColor = "#CBD5E1",
  className = "",
}: DottedMapProps) {
  const map = new DottedMapLib({ height: SVG_H, grid: "diagonal" });

  const svgString = map.getSVG({
    radius: 0.22,
    color: dotColor,
    shape: "circle",
    backgroundColor: "transparent",
  });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base dot world map */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`}
        className="w-full h-auto select-none pointer-events-none"
        alt="world map"
        draggable={false}
      />

      {/* Connection arcs + endpoint markers */}
      {dots.length > 0 && (
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {dots.map((_, i) => (
              <linearGradient
                key={`grad-${i}`}
                id={`arc-grad-${i}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor={lineColor} stopOpacity="0.9" />
                <stop offset="50%"  stopColor={lineColor} stopOpacity="1"   />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0.3" />
              </linearGradient>
            ))}
          </defs>

          {dots.map((dot, i) => {
            const s = project(dot.start.lat, dot.start.lng);
            const e = project(dot.end.lat, dot.end.lng);
            // Control point lifts the arc above the midpoint
            const mx = (s.x + e.x) / 2;
            const dy = Math.abs(e.x - s.x) * 0.18; // arc height proportional to distance
            const my = Math.min(s.y, e.y) - dy;

            return (
              <g key={i}>
                {/* Arc path */}
                <path
                  d={`M ${s.x} ${s.y} Q ${mx} ${my} ${e.x} ${e.y}`}
                  fill="none"
                  stroke={`url(#arc-grad-${i})`}
                  strokeWidth="0.35"
                  strokeLinecap="round"
                />

                {/* Origin dot (Colombo) */}
                <circle cx={s.x} cy={s.y} r="0.6"  fill={lineColor} opacity="0.9" />
                <circle cx={s.x} cy={s.y} r="1.4"  fill="none" stroke={lineColor} strokeWidth="0.2" opacity="0.35" />
                <circle cx={s.x} cy={s.y} r="2.2"  fill="none" stroke={lineColor} strokeWidth="0.15" opacity="0.15" />

                {/* Destination dot */}
                <circle cx={e.x} cy={e.y} r="0.55" fill={lineColor} opacity="0.85" />
                <circle cx={e.x} cy={e.y} r="1.3"  fill="none" stroke={lineColor} strokeWidth="0.18" opacity="0.3" />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
