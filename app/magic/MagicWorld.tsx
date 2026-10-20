"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { CHARACTERS, type CharacterId } from "./content";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// A sakura valley to walk through: the 3D world fills the screen, with a character picker
// and a controls hint on top.
export default function MagicWorld() {
  const [character, setCharacter] = useState<CharacterId>("mage");
  const webgl = useSyncExternalStore(
    () => () => {},
    hasWebGL,
    () => null,
  );

  return (
    <main className="relative h-screen overflow-hidden bg-[#a3ada8] text-slate-100">
      <div className="absolute inset-0 z-0">
        {webgl && <Scene character={character} />}
        {webgl === false && (
          <div className="flex h-full items-center justify-center p-6 text-center text-slate-800">
            <p>
              3D needs WebGL, which is unavailable here.{" "}
              <a href="/classic" className="underline">
                View the classic site
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto absolute right-5 top-5 flex gap-2">
          {CHARACTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCharacter(c.id)}
              className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] backdrop-blur-md transition ${
                character === c.id
                  ? "border-white/80 bg-white/30 text-white"
                  : "border-white/40 bg-black/20 text-white/80 hover:bg-white/15"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/25 px-4 py-2 text-center text-[11px] uppercase tracking-[0.3em] text-white/90 backdrop-blur-md">
          WASD / arrows walk · shift run · drag to look · wheel zoom
        </p>
      </div>
    </main>
  );
}
