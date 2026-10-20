"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { stations } from "./content";
import { readScroll, scrollState } from "./scroll";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const SECTION_VH = 140; // scroll distance per station

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function MagicWorld() {
  const panels = useRef<(HTMLElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const webgl = useSyncExternalStore(
    () => () => {},
    hasWebGL,
    () => null,
  );

  useEffect(() => {
    // Fade/slide each text panel in as its rune wakes, keyed off the eased scroll value.
    let raf = 0;
    const tick = () => {
      const s = scrollState.smooth;
      stations.forEach((st, i) => {
        const el = panels.current[i];
        if (!el) return;
        const d = Math.abs(s - st.t);
        const a = Math.max(0, Math.min(1, 1 - (d - 0.025) / 0.07));
        const dir = s < st.t ? 1 : -1;
        el.style.opacity = String(a);
        el.style.transform = `translateY(${(1 - a) * 28 * dir}px)`;
        el.style.filter = `blur(${(1 - a) * 6}px)`;
        el.style.pointerEvents = a > 0.6 ? "auto" : "none";
      });
      if (bar.current) bar.current.style.transform = `scaleY(${s})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      scrollState.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      scrollState.mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <main className="relative bg-[#050816] text-slate-100">
      {/* the world */}
      <div className="fixed inset-0 z-0">
        {webgl && <Scene />}
        {webgl === false && (
          <div className="flex h-full items-center justify-center p-6 text-center text-slate-300">
            <p>
              3D needs WebGL, which is unavailable here.{" "}
              <a href="/classic" className="text-cyan-300 underline">
                View the classic site
              </a>
            </p>
          </div>
        )}
      </div>

      {/* text for each rune */}
      <div className="pointer-events-none fixed inset-0 z-10">
        {stations.map((st, i) => (
          <section
            key={st.id}
            ref={(el) => {
              panels.current[i] = el;
            }}
            style={{ opacity: 0 }}
            className={`absolute top-1/2 w-[min(92vw,30rem)] -translate-y-1/2 will-change-transform ${
              st.side === "left"
                ? "left-[5vw]"
                : st.side === "right"
                  ? "right-[5vw]"
                  : "left-1/2 -translate-x-1/2 text-center"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              {st.kicker}
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-white drop-shadow-[0_0_18px_rgba(56,189,248,0.55)] sm:text-5xl">
              {st.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{st.body}</p>
            {st.tags && (
              <div
                className={`mt-5 flex flex-wrap gap-2 ${st.side === "center" ? "justify-center" : ""}`}
              >
                {st.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {st.links && (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {st.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="rounded-full border border-cyan-300/50 px-5 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </section>
        ))}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.4em] text-slate-400/70">
          scroll
        </p>
        <div className="absolute right-5 top-1/2 h-40 w-px -translate-y-1/2 bg-white/10">
          <div
            ref={bar}
            className="h-full origin-top bg-cyan-300 shadow-[0_0_8px_#67e8f9]"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
      </div>

      {/* invisible scroll track that drives everything */}
      <div style={{ height: `${stations.length * SECTION_VH}vh` }} aria-hidden />
    </main>
  );
}
