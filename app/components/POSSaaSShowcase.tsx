"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const heroSlides = [
  { title: "POS Dashboard", image: "/pos/poshome.png" },
  { title: "Auto Backup System", image: "/pos/backupautosingup.png" },
];

const metrics = [
  { value: "$0/mo", label: "Server Hosting Cost" },
  { value: "10+", label: "Active Retail Shops" },
  { value: "5–10s", label: "Average Invoice Time" },
];

const techStack = [
  { label: "Electron.js", color: "blue" },
  { label: "Node.js + Express", color: "emerald" },
  { label: "MySQL / PostgreSQL", color: "yellow" },
  { label: "Google Drive API", color: "indigo" },
  { label: "GitHub Releases", color: "purple" },
];

const colorVariants: Record<string, string> = {
  blue:    "bg-blue-50    text-blue-700    border-blue-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  yellow:  "bg-yellow-50  text-yellow-700  border-yellow-200",
  indigo:  "bg-indigo-50  text-indigo-700  border-indigo-200",
  purple:  "bg-purple-50  text-purple-700  border-purple-200",
  cyan:    "bg-cyan-50    text-cyan-700    border-cyan-200",
  orange:  "bg-orange-50  text-orange-700  border-orange-200",
};

const challenges = [
  {
    icon: "💸",
    title: "$50–200/mo Server Bills",
    problem: "Traditional POS systems charge monthly for cloud hosting — unaffordable for small retail startups.",
    solution: "Offline-first Electron app backs up to the user's own Google Drive. Server cost: effectively $0.",
  },
  {
    icon: "📡",
    title: "Internet = Single Point of Failure",
    problem: "Cloud-only POS stops working during network outages — halting sales at the worst moment.",
    solution: "Local SQLite database keeps the system fully operational offline. Syncs when connection restores.",
  },
  {
    icon: "⏱️",
    title: "30–45 Second Checkout Times",
    problem: "Mouse-dependent workflows forced cashiers to click through multiple screens per sale.",
    solution: "Keyboard-first UI with barcode scanning and auto-focus drops invoice time to 5–10 seconds.",
  },
  {
    icon: "🔄",
    title: "Manual Update Nightmares",
    problem: "Pushing updates to 10+ shops meant visiting each machine or sending files over WhatsApp.",
    solution: "GitHub Releases integration auto-updates all installations silently on next launch.",
  },
];

const features: FeatureProps[] = [
  {
    tag: "Cloud Architecture",
    title: "Zero-Cost Backup via Google Drive",
    subtitle: "Offline-first. Auto-synced. No server required.",
    body: "Instead of paying $50–200/month for a cloud database, I built the app to store all data locally and back up automatically to the shop owner's own Google Drive on logout. Subscription validation uses a lightweight JWT API — costing pennies instead of hundreds. The result: enterprise reliability at startup pricing.",
    highlights: [
      "Auto-backup to owner's Google Drive on every logout — zero server storage",
      "Backup history with timestamped restore points for full data recovery",
      "JWT token subscription validation with automated renewal reminders",
      "Offline-first: works without internet, syncs when connection is available",
      "GitHub Releases auto-update — one push updates all 10+ shops simultaneously",
    ],
    impact: [
      { value: "$0/mo", label: "vs $50–200 competitors" },
      { value: "100%", label: "Update adoption rate" },
      { value: "10+ shops", label: "Since Dec 2024" },
    ],
    images: ["/pos/backupautosingup.png", "/pos/backuphistory.png"],
    accentColor: "blue",
    isOdd: true,
  },
  {
    tag: "Inventory",
    title: "Multi-Variant Product & Barcode System",
    subtitle: "Any product. Any unit. Any variant.",
    body: "Most POS systems handle only simple unit-based products. This system supports both unit-based (pieces, boxes) and measurement-based (kg, ml, meters) products in the same invoice — critical for general stores. Each variant gets its own barcode, cost price, and margin tracking.",
    highlights: [
      "Multiple variants per product — size, colour, packaging — each with unique barcode",
      "Dual invoicing modes: unit-based and measurement-based in one transaction",
      "Per-variant cost tracking for accurate profit margin on every sale",
      "Low stock alerts with customisable thresholds to prevent stockouts",
      "Barcode label printer integration for fast shelf labelling",
    ],
    impact: [
      { value: "Instant", label: "Variant lookup via scan" },
      { value: "Dual-mode", label: "Unit + measurement" },
      { value: "Real-time", label: "Low stock alerts" },
    ],
    images: ["/pos/inventory.png", "/pos/lableprint.png"],
    accentColor: "emerald",
    isOdd: false,
  },
  {
    tag: "POS Interface",
    title: "Lightning-Fast Keyboard-Driven Checkout",
    subtitle: "Scan. Quantity. Payment. Done — no mouse needed.",
    body: "Every second saved per invoice multiplies across hundreds of daily transactions. I designed the checkout flow to be fully keyboard-driven — barcode scan auto-populates the item, Tab moves to quantity, Enter confirms, and F-keys trigger payment, discount, and print. Experienced cashiers can complete an invoice in 5–10 seconds.",
    highlights: [
      "Barcode scan + name search — find any product instantly, two ways",
      "F-key shortcuts for all actions: add, remove, discount, payment, print",
      "Auto-focus anticipates next input — barcode → quantity → amount, seamlessly",
      "Low stock warnings shown during invoicing to prevent overselling",
      "One-click thermal receipt print with automatic cash drawer trigger",
    ],
    impact: [
      { value: "5–10s", label: "Invoice completion" },
      { value: "Zero", label: "Mouse clicks required" },
      { value: "100%", label: "Keyboard-driven flow" },
    ],
    images: ["/pos/posui.png"],
    accentColor: "orange",
    isOdd: true,
  },
  {
    tag: "Analytics",
    title: "Profit-First Invoice Analytics",
    subtitle: "COGS. Margins. Trends — built for owners, not accountants.",
    body: "Shop owners needed to know not just what sold, but what actually made money. Every invoice tracks cost of goods sold (COGS) alongside sale price, so profit margin is visible per transaction. Date-range filtering shows daily, weekly, and monthly trends without needing a separate accounting tool.",
    highlights: [
      "Per-invoice profit: sale price, COGS, and margin calculated automatically",
      "Date-range filters: daily, weekly, monthly performance at a glance",
      "Best-seller and slow-mover reports to guide restocking decisions",
      "Exportable reports for accounting and tax filing",
      "Total items sold breakdown by product and variant",
    ],
    impact: [
      { value: "Real-time", label: "Profit per invoice" },
      { value: "Item-level", label: "Cost tracking" },
      { value: "Exportable", label: "Tax-ready reports" },
    ],
    images: ["/pos/invoicereport.png"],
    accentColor: "indigo",
    isOdd: false,
  },
];

const skillGroups = [
  {
    title: "Desktop Architecture",
    color: "blue",
    skills: ["Electron.js App Dev", "Offline-First Design", "Google Drive API", "GitHub Auto-Update", "JWT Authentication", "Cost Optimisation"],
  },
  {
    title: "Full-Stack Development",
    color: "emerald",
    skills: ["Node.js + Express", "MySQL & PostgreSQL", "Barcode Integration", "Thermal Print API", "REST API Design", "Local Data Storage"],
  },
  {
    title: "Product & Business",
    color: "purple",
    skills: ["SaaS Pricing Model", "Market Gap Analysis", "UX Speed Optimisation", "Customer Deployment", "Subscription Management", "Production Support"],
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const POSSaaSShowcase: React.FC = () => {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setHeroSlide((p) => (p + 1) % heroSlides.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <PhotoProvider>
      <div id="showcase-container" className="w-full bg-slate-50 text-zinc-900">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden border-b border-zinc-200 bg-white px-6 py-20 md:px-16">
          <div
            className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-emerald-100/50 blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-6xl">
            <span className="mb-4 inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-orange-600">
              Live Product · SaaS Desktop POS
            </span>

            <div className="grid items-center gap-12 md:grid-cols-2">
              {/* Left: Text */}
              <div>
                <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-zinc-900 md:text-5xl">
                  Zero-Cost POS SaaS
                  <br />
                  <span className="text-emerald-600">for Small Retail</span>
                </h1>
                <p className="mb-8 text-lg leading-relaxed text-zinc-500">
                  Cloud-connected desktop POS that eliminated server hosting
                  costs entirely — using Google Drive as the backend. Built,
                  deployed, and actively serving 10+ shops since December 2024.
                </p>

                {/* Metrics */}
                <div className="mb-8 grid grid-cols-3 gap-4">
                  {metrics.map((m) => (
                    <div key={m.value} className="rounded-xl border border-zinc-200 bg-slate-50 p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-600">{m.value}</p>
                      <p className="mt-1 text-xs text-zinc-500">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {techStack.map((t) => (
                    <span
                      key={t.label}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${colorVariants[t.color]}`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Carousel */}
              <div className="relative">
                <PhotoView src={heroSlides[heroSlide].image}>
                  <div className="relative h-80 cursor-zoom-in overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-lg transition-all hover:shadow-xl">
                    {heroSlides.map((slide, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-700 ${idx === heroSlide ? "opacity-100" : "opacity-0"}`}
                      >
                        <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={idx === 0} />
                      </div>
                    ))}
                    <div className="absolute right-3 top-3 rounded-lg border border-zinc-300 bg-white/80 p-2 backdrop-blur-sm">
                      <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                </PhotoView>

                <button
                  onClick={() => setHeroSlide((p) => (p === 0 ? heroSlides.length - 1 : p - 1))}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 shadow-sm transition hover:bg-zinc-50"
                >
                  <ChevronLeft className="h-4 w-4 text-zinc-600" />
                </button>
                <button
                  onClick={() => setHeroSlide((p) => (p === heroSlides.length - 1 ? 0 : p + 1))}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 shadow-sm transition hover:bg-zinc-50"
                >
                  <ChevronRight className="h-4 w-4 text-zinc-600" />
                </button>

                <div className="mt-4 flex justify-center gap-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroSlide(i)}
                      className={`h-2 rounded-full transition-all ${i === heroSlide ? "w-6 bg-emerald-500" : "w-2 bg-zinc-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHALLENGES ── */}
        <section className="border-b border-zinc-200 bg-slate-50 px-6 py-20 md:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-500">
              The Market Gap I Found.
            </p>
            <h2 className="mb-3 text-3xl font-bold text-zinc-900 md:text-4xl">
              Why Existing POS Systems Failed Small Shops
            </h2>
            <p className="mb-12 max-w-xl text-zinc-500">
              Small retailers needed enterprise features — not enterprise pricing.
              Each problem below shaped a core architectural decision.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {challenges.map((c) => (
                <div key={c.title} className="rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md">
                  <span className="mb-4 block text-3xl">{c.icon}</span>
                  <h3 className="mb-2 font-semibold text-zinc-900">{c.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-red-500">{c.problem}</p>
                  <div className="border-t border-zinc-100 pt-4">
                    <p className="text-sm leading-relaxed text-emerald-600">{c.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        {features.map((f) => (
          <FeatureSection key={f.tag} {...f} />
        ))}

        {/* ── SKILLS ── */}
        <section className="border-t border-zinc-200 bg-white px-6 py-20 md:px-16">
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-500">
              Skills Demonstrated
            </p>
            <h2 className="mb-12 text-3xl font-bold text-zinc-900 md:text-4xl">
              What This Project Proves
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {skillGroups.map((g) => (
                <div key={g.title}>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                    {g.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {g.skills.map((s) => (
                      <span
                        key={s}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium ${colorVariants[g.color]}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PhotoProvider>
  );
};

/* ─────────────────────────────────────────────
   FEATURE SECTION COMPONENT
───────────────────────────────────────────── */
type FeatureProps = {
  tag: string;
  title: string;
  subtitle: string;
  body: string;
  highlights: string[];
  impact: { value: string; label: string }[];
  images: string[];
  accentColor: string;
  isOdd: boolean;
};

const accentMap: Record<string, { tag: string; dot: string; metric: string; border: string }> = {
  blue:    { tag: "bg-blue-50 text-blue-600 border-blue-200",       dot: "bg-blue-400",    metric: "text-blue-600",    border: "border-blue-200" },
  emerald: { tag: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400", metric: "text-emerald-600", border: "border-emerald-200" },
  orange:  { tag: "bg-orange-50 text-orange-600 border-orange-200", dot: "bg-orange-400",  metric: "text-orange-600",  border: "border-orange-200" },
  indigo:  { tag: "bg-indigo-50 text-indigo-600 border-indigo-200", dot: "bg-indigo-400",  metric: "text-indigo-600",  border: "border-indigo-200" },
};

const FeatureSection: React.FC<FeatureProps> = ({
  tag, title, subtitle, body, highlights, impact, images, accentColor, isOdd,
}) => {
  const [imgIdx, setImgIdx] = useState(0);
  const accent = accentMap[accentColor] ?? accentMap.blue;

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setImgIdx((p) => (p + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);

  const imagePanel = (
    <div className="relative">
      <PhotoView src={images[imgIdx] ?? images[0]}>
        <div className={`group relative h-80 cursor-zoom-in overflow-hidden rounded-2xl border bg-zinc-100 shadow-sm transition-all hover:shadow-lg ${accent.border}`}>
          {images.map((src, idx) => (
            <div key={src} className={`absolute inset-0 transition-opacity duration-700 ${idx === imgIdx ? "opacity-100" : "opacity-0"}`}>
              <Image src={src} alt={`${title} ${idx + 1}`} fill className="object-contain" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          ))}
          <div className="absolute right-3 top-3 rounded-lg border border-zinc-300 bg-white/80 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white">
              {imgIdx + 1}/{images.length}
            </div>
          )}
        </div>
      </PhotoView>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setImgIdx((p) => (p === 0 ? images.length - 1 : p - 1)); }}
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 shadow-sm transition hover:bg-zinc-50"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4 text-zinc-600" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setImgIdx((p) => (p === images.length - 1 ? 0 : p + 1)); }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 shadow-sm transition hover:bg-zinc-50"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4 text-zinc-600" />
          </button>
        </>
      )}
    </div>
  );

  const contentPanel = (
    <div>
      <span className={`mb-4 inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${accent.tag}`}>
        {tag}
      </span>
      <h3 className="mb-2 text-2xl font-bold leading-tight text-zinc-900 md:text-3xl">{title}</h3>
      <p className={`mb-5 text-base font-medium ${accent.metric}`}>{subtitle}</p>
      <p className="mb-6 leading-relaxed text-zinc-500">{body}</p>

      <ul className="mb-8 space-y-2.5">
        {highlights.map((h) => (
          <li key={h} className="flex items-start gap-3 text-sm text-zinc-600">
            <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${accent.dot}`} />
            {h}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-3 gap-3">
        {impact.map((i) => (
          <div key={i.label} className={`rounded-xl border p-3 text-center ${accent.border} bg-slate-50`}>
            <p className={`text-lg font-bold ${accent.metric}`}>{i.value}</p>
            <p className="mt-0.5 text-xs text-zinc-400">{i.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className={`border-b border-zinc-200 px-6 py-20 md:px-16 ${isOdd ? "bg-white" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {isOdd ? (
            <>{imagePanel}{contentPanel}</>
          ) : (
            <>{contentPanel}{imagePanel}</>
          )}
        </div>
      </div>
    </section>
  );
};

export default POSSaaSShowcase;
