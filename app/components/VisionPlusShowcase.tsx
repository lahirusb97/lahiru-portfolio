"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────
   HERO CAROUSEL
───────────────────────────────────────────── */
const heroSlides = [
  { title: "Vision Plus Storefront", image: "/visionplus/visionplusfront.jpeg" },
  { title: "Vision Plus Interior", image: "/visionplus/visionplusinventory.jpeg" },
];

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const metrics = [
  { value: "60%", label: "Faster Order Processing" },
  { value: "95%", label: "Fewer Inventory Errors" },
  { value: "15 Branches", label: "Managed in Real-Time" },
];

const techStack = [
  { label: "Django REST", color: "emerald" },
  { label: "React + Vite", color: "cyan" },
  { label: "MySQL", color: "blue" },
  { label: "Hostinger KVM", color: "indigo" },
];

const colorVariants: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cyan:    "bg-cyan-50    text-cyan-700    border-cyan-200",
  blue:    "bg-blue-50    text-blue-700    border-blue-200",
  indigo:  "bg-indigo-50  text-indigo-700  border-indigo-200",
  orange:  "bg-orange-50  text-orange-700  border-orange-200",
  purple:  "bg-purple-50  text-purple-700  border-purple-200",
};

const challenges = [
  {
    icon: "📋",
    title: "Paper-Based Orders",
    problem: "5 different order types handled on paper — causing errors, lost records, and no visibility.",
    solution: "Digitized into 5 specialized invoice flows with stage-by-stage tracking from factory to delivery.",
  },
  {
    icon: "📅",
    title: "22% Appointment No-Shows",
    problem: "8–9 lost consultations daily. Staff manually chasing patients after missed slots.",
    solution: "Automated 5-minute interval detection triggers SMS alerts before appointments are lost.",
  },
  {
    icon: "📦",
    title: "18% Inventory Variance",
    problem: "Stock tracked via WhatsApp & Excel across 15 branches — ghost inventory, disputes, lost items.",
    solution: "Item-level forensic tracking with 3-stage transfer workflow and real-time branch sync.",
  },
  {
    icon: "💰",
    title: "Rs. 675K Locked in Unpaid Orders",
    problem: "Zero advance payment enforcement — capital tied up for weeks with no recovery system.",
    solution: "Mandatory payment gates, auto-hold system, and SMS reminders recovered Rs. 5.76M annually.",
  },
];

const features: FeatureProps[] = [
  {
    tag: "Patient Management",
    title: "Complete Patient & Prescription History",
    subtitle: "Instant lookup. Zero duplicates. Full audit trail.",
    body: "Patients searched by NIC, mobile, or name in under a second. Every prescription change is logged with user ID and timestamp — eliminating disputes, preventing duplicates, and meeting medical data accountability standards.",
    highlights: [
      "NIC + mobile enforced as unique identifiers — zero duplicate records",
      "Timeline view of all prescriptions and orders per patient",
      "Audit log captures every edit: who changed what, and when",
      "One-click shortcut to carry forward previous Rx values",
    ],
    impact: [
      { value: "< 1s", label: "Patient lookup" },
      { value: "100%", label: "Data integrity" },
      { value: "0", label: "Duplicate records" },
    ],
    images: ["/visionplus/patienttracking.png", "/visionplus/refractionaudit.png"],
    accentColor: "blue",
    isOdd: true,
  },
  {
    tag: "Scheduling",
    title: "Smart Appointment System with No-Show Prevention",
    subtitle: "Proactive intervention. Automated alerts. Rescued revenue.",
    body: "Instead of reacting to missed appointments, the system monitors every slot every 5 minutes. When scheduled time hits and status isn't 'Arrived', it triggers an automated SMS and flags the receptionist — turning a reactive problem into a preventive system.",
    highlights: [
      "Color-coded doctor arrival dates for instant daily planning",
      "Double-booking prevention with hard validation rules",
      "Automatic SMS confirmation sent on every booking",
      "5-minute interval no-show detection with automated intervention",
    ],
    impact: [
      { value: "99%", label: "Fewer scheduling conflicts" },
      { value: "40%+", label: "More appointment capacity" },
      { value: "22%→8%", label: "No-show rate reduced" },
    ],
    images: ["/visionplus/appointment.jpg"],
    accentColor: "indigo",
    isOdd: false,
  },
  {
    tag: "Orders & Invoicing",
    title: "5-Type Order System with Financial Controls",
    subtitle: "Specialized forms. Payment enforcement. Zero fraud.",
    body: "One system handles Factory, Normal, Frame-Only, Hearing Aid, and Soldering orders — each with tailored fields, mandatory advance payment gates, and complete edit audit trails. Every stage from 'Received from Customer' to 'Issued to Customer' is timestamped and traceable.",
    highlights: [
      "5 invoice types with context-specific fields eliminating staff confusion",
      "4-stage order tracking: Customer → Factory → Factory Return → Customer",
      "Mandatory advance payment — auto-hold triggers on insufficient balance",
      "Every edit logged with old/new values, user ID, and timestamp",
      "MNT remake tracking links remakes to original orders with reason codes",
    ],
    impact: [
      { value: "85%", label: "Processing accuracy" },
      { value: "12%→4%", label: "Remake rate" },
      { value: "Rs.5.76M", label: "Recovered annually" },
    ],
    images: ["/visionplus/order.png", "/visionplus/checkin.png"],
    accentColor: "orange",
    isOdd: true,
  },
  {
    tag: "Inventory",
    title: "Forensic-Level Multi-Branch Inventory",
    subtitle: "Item-level traceability. Real-time sync. Zero ghost stock.",
    body: "Every frame and lens has a complete digital paper trail — when it entered which branch, who handled it, where it moved, and its current status. The 3-stage transfer workflow (Initiated → In Transit → Received) replaced WhatsApp coordination and eliminated a 3-day investigation process.",
    highlights: [
      "Item-level tracking: branch, staff ID, timestamp, source, and image",
      "3-stage transfer workflow with SMS notification to destination branch",
      "6+ reports: stock history, additions, removals, lifecycle, and variance",
      "Color-coded alerts — Red: Critical, Yellow: Low, Green: Optimal",
      "Transfer ID generated per movement with receipt confirmation required",
    ],
    impact: [
      { value: "95%", label: "Inventory accuracy" },
      { value: "3h→15min", label: "Item location time" },
      { value: "40%", label: "Fewer emergency transfers" },
    ],
    images: ["/visionplus/inventory.png", "/visionplus/frametable.png"],
    accentColor: "emerald",
    isOdd: false,
  },
];

const skillGroups = [
  {
    title: "Full-Stack Development",
    color: "blue",
    skills: ["Django REST API", "React + Vite", "MySQL Schema Design", "Authentication & Roles", "Real-Time Sync", "PDF Report Generation"],
  },
  {
    title: "Systems Design",
    color: "indigo",
    skills: ["Multi-Branch Architecture", "Audit Trail Systems", "Payment Gate Logic", "Automated SMS Workflows", "Transfer Tracking", "Stage-Based Order Flows"],
  },
  {
    title: "Business Outcomes",
    color: "emerald",
    skills: ["Requirements Analysis", "Process Automation", "Financial Controls", "Stakeholder Training", "Revenue Recovery", "Operational ROI"],
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const VisionPlusShowcase: React.FC = () => {
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
          {/* Subtle orb */}
          <div
            className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-6xl">
            {/* Label */}
            <span className="mb-4 inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-orange-600">
              Featured Project · Full-Stack ERP
            </span>

            <div className="grid items-center gap-12 md:grid-cols-2">
              {/* Left: Text */}
              <div>
                <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-zinc-900 md:text-5xl">
                  Vision Plus Eye Clinic
                  <br />
                  <span className="text-blue-600">Chain ERP System</span>
                </h1>
                <p className="mb-8 text-lg leading-relaxed text-zinc-500">
                  End-to-end practice management platform for a 15-branch optical
                  chain — built solo, deployed to production, actively used daily.
                  Replaced paper workflows, WhatsApp coordination, and Excel
                  tracking with a unified system.
                </p>

                {/* Metrics */}
                <div className="mb-8 grid grid-cols-3 gap-4">
                  {metrics.map((m) => (
                    <div key={m.value} className="rounded-xl border border-zinc-200 bg-slate-50 p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{m.value}</p>
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

              {/* Right: Image carousel */}
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
                    {/* Zoom hint */}
                    <div className="absolute right-3 top-3 rounded-lg border border-zinc-300 bg-white/80 p-2 backdrop-blur-sm">
                      <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                </PhotoView>

                {/* Nav */}
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

                {/* Dots */}
                <div className="mt-4 flex justify-center gap-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroSlide(i)}
                      className={`h-2 rounded-full transition-all ${i === heroSlide ? "w-6 bg-blue-500" : "w-2 bg-zinc-300"}`}
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
              Real Problems. Real Solutions.
            </p>
            <h2 className="mb-3 text-3xl font-bold text-zinc-900 md:text-4xl">
              What I Was Hired to Fix
            </h2>
            <p className="mb-12 max-w-xl text-zinc-500">
              Every feature was built around a measurable business problem — not
              assumptions.
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
  blue:    { tag: "bg-blue-50 text-blue-600 border-blue-200",    dot: "bg-blue-400",    metric: "text-blue-600",    border: "border-blue-200" },
  indigo:  { tag: "bg-indigo-50 text-indigo-600 border-indigo-200", dot: "bg-indigo-400", metric: "text-indigo-600", border: "border-indigo-200" },
  orange:  { tag: "bg-orange-50 text-orange-600 border-orange-200", dot: "bg-orange-400", metric: "text-orange-600", border: "border-orange-200" },
  emerald: { tag: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400", metric: "text-emerald-600", border: "border-emerald-200" },
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
          {/* Zoom hint */}
          <div className="absolute right-3 top-3 rounded-lg border border-zinc-300 bg-white/80 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white">
              {imgIdx + 1}/{images.length}
            </div>
          )}
        </div>
      </PhotoView>

      {/* Arrows */}
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

      {/* Highlights */}
      <ul className="mb-8 space-y-2.5">
        {highlights.map((h) => (
          <li key={h} className="flex items-start gap-3 text-sm text-zinc-600">
            <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${accent.dot}`} />
            {h}
          </li>
        ))}
      </ul>

      {/* Impact */}
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
        <div className={`grid items-center gap-16 md:grid-cols-2`}>
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

export default VisionPlusShowcase;
