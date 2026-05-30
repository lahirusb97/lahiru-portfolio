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
  { title: "Secure Login", image: "/eyecare/login.png" },
  { title: "Organisation Registration", image: "/eyecare/registration.png" },
  { title: "Branch Selection", image: "/eyecare/branch-select.png" },
  { title: "Prescription Form", image: "/eyecare/prescriptionform.png" },
  { title: "Appointment Scheduling", image: "/eyecare/appointment.png" },
  { title: "Order Tracking", image: "/eyecare/tracking.png" },
  { title: "Inventory Management", image: "/eyecare/inventory-management.png" },
  { title: "Financial Reports", image: "/eyecare/payment-report.png" },
  { title: "Orders List", image: "/eyecare/order-list.png" },
  { title: "Patient History", image: "/eyecare/patient-history.png" },
];

const metrics = [
  { value: "Multi-Tenant", label: "Single DB, Zero Data Leakage" },
  { value: "Unlimited", label: "Branches per Organisation" },
  { value: "3-Layer", label: "Medical Data Validation" },
  { value: "6-Stage", label: "Factory Order Tracking" },
  { value: "Public", label: "Patient Self-Booking" },
  { value: "3 Types", label: "Order Workflows" },
];

const techStack = [
  { label: ".NET ASP Core", color: "purple" },
  { label: "React + TypeScript", color: "cyan" },
  { label: "PostgreSQL", color: "blue" },
  { label: "Digital Ocean", color: "teal" },
  { label: "Entity Framework", color: "indigo" },
];

const colorVariants: Record<string, string> = {
  purple:  "bg-purple-50  text-purple-700  border-purple-200",
  cyan:    "bg-cyan-50    text-cyan-700    border-cyan-200",
  blue:    "bg-blue-50    text-blue-700    border-blue-200",
  teal:    "bg-teal-50    text-teal-700    border-teal-200",
  indigo:  "bg-indigo-50  text-indigo-700  border-indigo-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  orange:  "bg-orange-50  text-orange-700  border-orange-200",
};

const challenges = [
  {
    icon: "🏗️",
    title: "Multi-Tenancy vs Data Safety",
    problem: "Separate DB per clinic = $50–100/mo per org. Shared DB without isolation = HIPAA nightmare and data leakage risk.",
    solution: ".NET middleware with row-level tenant isolation auto-filters every query by org ID — zero cross-tenant data leakage, one database.",
  },
  {
    icon: "🔐",
    title: "Branch-Level Access Control",
    problem: "Staff working across branches could access locations they weren't authorised for — no enforcement beyond the UI.",
    solution: "Branch permissions embedded in JWT claims and enforced at API level — backend rejects unauthorised requests regardless of frontend state.",
  },
  {
    icon: "💊",
    title: "Medical Form Errors",
    problem: "Invalid prescription values (wrong SPH range, incompatible CYL/Axis) entered without validation — reaching factory orders with wrong specs.",
    solution: "Triple-layer validation: Zod catches errors on keystroke, React Hook Form blocks submission, .NET API validates again on the server.",
  },
  {
    icon: "📦",
    title: "Inventory Blind Spots",
    problem: "Each branch tracked stock independently. Customers were told 'out of stock' while other branches had excess sitting idle.",
    solution: "Centralised multi-branch inventory with real-time visibility, lens variant tracking (SPH/CYL/Axis/coating), and inter-branch transfer workflow.",
  },
];

const features: FeatureProps[] = [
  {
    tag: "SaaS Architecture",
    title: "Multi-Tenant Isolation via .NET Middleware",
    subtitle: "$0 extra cost per new clinic. 100% data separation guaranteed.",
    body: "The hardest architectural decision in any healthcare SaaS: shared database is cheap but risky; separate databases are secure but expensive. I implemented row-level tenant isolation using custom .NET middleware — every API request extracts the org ID from JWT claims, and Entity Framework global query filters automatically scope all database queries. Zero cross-org leakage. Instant new-org provisioning. Predictable infrastructure costs.",
    highlights: [
      "Custom .NET middleware extracts tenant from JWT on every authenticated request",
      "Entity Framework global query filters — impossible to accidentally query cross-org data",
      "New organisation provisioning in seconds — no infrastructure changes required",
      "Unlimited branches per org based on subscription tier",
      "Usercode + password login optimised for fast daily clinical workflow",
    ],
    impact: [
      { value: "$0", label: "Cost per new organisation" },
      { value: "100%", label: "Tenant data isolation" },
      { value: "Instant", label: "Org provisioning" },
    ],
    images: ["/eyecare/login.png", "/eyecare/registration.png"],
    accentColor: "purple",
    isOdd: true,
  },
  {
    tag: "Access Control",
    title: "Branch-Wise User Permissions",
    subtitle: "Org → Branch → User. Enforced at the API, not just the UI.",
    body: "In a multi-branch clinic, a receptionist at Branch A must never see Branch B's patient records. I built cascading access control where every user's branch permissions are embedded in their JWT claims and validated by middleware on every request — not just checked in the frontend. Admins assign staff to branches via a dashboard; the API enforces it regardless.",
    highlights: [
      "Branch list filtered per user — staff only see locations they're authorised for",
      "Role-based permissions per branch: receptionist, doctor, branch manager",
      "API-level enforcement — frontend restrictions backed by backend security",
      "Session-based branch context persists across the app for data consistency",
      "Audit trail of all branch access changes for compliance reporting",
    ],
    impact: [
      { value: "Zero", label: "Unauthorised branch access" },
      { value: "Role-based", label: "Permissions per branch" },
      { value: "Complete", label: "Access audit trail" },
    ],
    images: ["/eyecare/branch-select.png", "/eyecare/userroles-branchwise-acess.png"],
    accentColor: "indigo",
    isOdd: false,
  },
  {
    tag: "Prescription Forms",
    title: "Triple-Layer Medical Data Validation",
    subtitle: "Zod → React Hook Form → .NET ASP. Invalid data never reaches the DB.",
    body: "Medical prescription forms are safety-critical. An invalid SPH/CYL combination reaching a factory order means wrong lenses manufactured for a patient. I built three independent validation layers: Zod schema validates optical ranges live on keystroke, React Hook Form blocks submission on any invalid field, and the .NET API re-validates every value server-side before persistence — because you never trust client-side for healthcare data.",
    highlights: [
      "Zod schema enforcing optical rules: SPH (−20 to +20), CYL/Axis combinations, PD ranges",
      "React Hook Form managing complex nested state — multiple prescriptions per patient",
      ".NET API Data Annotations + FluentValidation mirrors all frontend rules",
      "Prescription auto-increment per branch for audit trail and legal compliance",
      "Prescription history timeline — monitor vision changes over years per patient",
    ],
    impact: [
      { value: "Zero", label: "Invalid prescriptions submitted" },
      { value: "3-layer", label: "Validation depth" },
      { value: "100%", label: "Medical data integrity" },
    ],
    images: ["/eyecare/prescriptionform.png", "/eyecare/refraction-form.png"],
    accentColor: "teal",
    isOdd: true,
  },
  {
    tag: "Inventory",
    title: "Branch-Wise Optical Inventory",
    subtitle: "Frames, lenses, variants — all tracked per location in real-time.",
    body: "Optical inventory is uniquely complex — a single lens model can have dozens of variants (power, cylinder, axis, coating, material) and each branch holds its own stock. I built branch-isolated inventory with multi-variant SKU tracking, a factory lens ordering integration for custom prescriptions, and an inter-branch transfer workflow so excess stock moves to where it's needed.",
    highlights: [
      "Branch-isolated stock levels for frames, lenses, and accessories in real-time",
      "Multi-variant lens tracking: SPH, CYL, Axis, ADD, coating, material per SKU",
      "External factory order integration — automated purchase orders for custom Rx",
      "Frame variant catalog: size, colour, brand, model per branch",
      "Inter-branch stock transfer with approval workflow",
      "Low stock alerts per branch preventing customer-facing stockouts",
    ],
    impact: [
      { value: "Real-time", label: "Multi-branch visibility" },
      { value: "Automated", label: "Factory order flow" },
      { value: "Zero", label: "Variant tracking errors" },
    ],
    images: ["/eyecare/stock.png", "/eyecare/inventory-management.png"],
    accentColor: "emerald",
    isOdd: false,
  },
  {
    tag: "Patient & Invoicing",
    title: "Prescription-to-Invoice in One Flow",
    subtitle: "Register. Examine. Invoice. Prescription pre-fills the lens filter.",
    body: "From patient walk-in to invoice, the workflow is a single connected flow. Patient registration takes under 30 seconds with duplicate detection. After examination, the prescription data automatically filters matching lens inventory by SPH and CYL — the correct products surface without manual lookup. Long-term history tracks every order, prescription, and appointment per patient across all branches.",
    highlights: [
      "Quick patient registration with duplicate detection — no duplicate records",
      "Full patient profile: demographics, insurance, medical history in one place",
      "Prescription-to-invoice: SPH/CYL values auto-filter matching lens inventory",
      "Long-term history: all purchases, prescriptions, and appointments per patient",
      "Flexible billing — any inventory item (frames, accessories, services) on one invoice",
      "Prescription history timeline for clinical decision support over time",
    ],
    impact: [
      { value: "< 30s", label: "Patient registration" },
      { value: "Instant", label: "Prescription-to-invoice" },
      { value: "Complete", label: "Long-term history" },
    ],
    images: ["/eyecare/patient-register.png", "/eyecare/patient-history.png", "/eyecare/factory-order.png", "/eyecare/lensfilter.png"],
    accentColor: "cyan",
    isOdd: true,
  },
  {
    tag: "Order Management",
    title: "Three Order Types. One Unified System.",
    subtitle: "Factory → Frame-Only → Normal. Each with its own optimised workflow.",
    body: "Optical practices don't fit a single order model — a custom prescription eyeglass order is fundamentally different from a walk-in frame sale. I built three independent order flows with shared payment infrastructure: Factory Orders with 6-stage manufacturing tracking, Frame-Only Orders with 4-stage fulfilment, and Normal Orders for accessories and services. Every order type supports split payments across Cash, Card, and Online Transfer.",
    highlights: [
      "Factory Orders: patient refraction auto-loaded, in-stock lenses filtered to prescription SPH/CYL automatically",
      "6-stage factory tracking: Received → Sent to Factory → Received → Sent to Fitting → Fitting Complete → Issued",
      "Frame-Only Orders: simplified flow, 4-stage tracking — no prescription data required",
      "Normal Orders: free-text line items for accessories, solutions, and clinic services",
      "Split payment support on all order types — Cash, Card, and Online Transfer in a single transaction",
      "On-Hold and Urgent flags, plus internal remarks attached to any order",
    ],
    impact: [
      { value: "6-Stage", label: "Factory tracking" },
      { value: "3 Types", label: "Order workflows" },
      { value: "Split", label: "Payment methods" },
    ],
    images: ["/eyecare/factory-order-form.png", "/eyecare/frame-only-order-form.png", "/eyecare/normal-order-form.png", "/eyecare/tracking.png", "/eyecare/trackign-table.png"],
    accentColor: "indigo",
    isOdd: false,
  },
  {
    tag: "Appointment Scheduling",
    title: "Public Self-Booking. No Login Required.",
    subtitle: "Patients book 24/7 via your clinic's public URL — staff just manage arrivals.",
    body: "Scheduling is the most patient-facing part of a clinic. I built a public booking system where patients visit your clinic's unique URL, pick a date and time slot, enter their details, and confirm — no account needed. The backend checks for existing patients by mobile or NIC to avoid duplicates. Admins set up doctor availability rules per branch (day, time range, slot duration, max bookings), and the system auto-generates the bookable slots — double-booking is architecturally impossible.",
    highlights: [
      "Patients self-book at /book/:clinic-slug — zero staff involvement for scheduling",
      "Existing patient detection by mobile or NIC — no duplicate records created",
      "Admin configures doctor rules: day of week, start/end time, slot duration, max bookings",
      "System auto-generates time slots from rules — no manual slot entry",
      "Dashboard filters appointments by branch, doctor, date, and status (Pending/Confirmed/Completed)",
      "Mark Arrival, Confirm, or Cancel appointments directly from the admin view",
    ],
    impact: [
      { value: "24/7", label: "Patient self-booking" },
      { value: "Zero", label: "Double-bookings possible" },
      { value: "Auto", label: "Slot generation" },
    ],
    images: ["/eyecare/appointment.png"],
    accentColor: "teal",
    isOdd: true,
  },
  {
    tag: "Financial Reports",
    title: "Revenue by Date, Order Type & Payment Method.",
    subtitle: "Daily totals. Invoice breakdown. Audit-ready.",
    body: "Clinic owners need to know what they collected, how, and from which order types — at a glance. The reports module provides daily revenue summaries broken down by Cash, Card, and Online Transfer, with per-order-type totals (Factory, Frame, Normal). Every invoice is listed with full payment split, and the repayment screen lets staff record partial or split payments against outstanding balances — with a full timestamped audit trail per invoice.",
    highlights: [
      "Grand Total + per-method breakdown (Cash, Card, Online) for any selected date",
      "Per order type revenue: Factory, Normal, and Frame orders with invoice counts",
      "Invoice table with patient name, order type, and per-method payment split",
      "Filter by date range and order type — paginated and export-ready",
      "Repayment screen: running balance, split payment entry, full payment history per invoice",
      "Every payment logged with date, time, and method — complete audit trail",
    ],
    impact: [
      { value: "Real-time", label: "Revenue summary" },
      { value: "3-method", label: "Payment breakdown" },
      { value: "Full", label: "Audit trail" },
    ],
    images: ["/eyecare/payment-report.png", "/eyecare/repayment.png"],
    accentColor: "emerald",
    isOdd: false,
  },
];

const skillGroups = [
  {
    title: "Backend Engineering",
    color: "purple",
    skills: [".NET ASP Core", "Multi-Tenancy Middleware", "Entity Framework", "FluentValidation", "JWT Auth & Claims", "RESTful API Design"],
  },
  {
    title: "Frontend Development",
    color: "cyan",
    skills: ["React + TypeScript", "Zod Schema Validation", "React Hook Form", "React Query", "Context API", "Component Architecture"],
  },
  {
    title: "Healthcare SaaS",
    color: "teal",
    skills: ["HIPAA Data Compliance", "Medical Form Validation", "Multi-Branch Operations", "Clinical Workflow Design", "Prescription Management", "Audit Trail Systems"],
  },
  {
    title: "Order & Inventory",
    color: "indigo",
    skills: ["Factory Order Workflow", "6-Stage Order Tracking", "Split Payment Processing", "Inventory Variant Tracking", "Inter-Branch Stock Transfer", "Public Booking API"],
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const EyeCareSaaSShowcase: React.FC = () => {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setHeroSlide((p) => (p + 1) % heroSlides.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <PhotoProvider>
      <div id="showcase-container" className="w-full bg-slate-50 text-zinc-900">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden border-b border-zinc-200 bg-white px-6 py-20 md:px-16">
          <div
            className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-purple-100/50 blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-6xl">
            <span className="mb-4 inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-orange-600">
              Healthcare SaaS · .NET ASP + React
            </span>

            <div className="grid items-center gap-12 md:grid-cols-2">
              {/* Left: Text */}
              <div>
                <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-zinc-900 md:text-5xl">
                  Eye Care Practice
                  <br />
                  <span className="text-purple-600">Management SaaS</span>
                </h1>
                <p className="mb-8 text-lg leading-relaxed text-zinc-500">
                  Enterprise multi-tenant SaaS for eye clinic chains — built from
                  scratch with .NET ASP and React. Handles multi-org isolation,
                  branch-level access control, validated prescription forms, and
                  prescription-driven invoicing in a single platform.
                </p>

                {/* Metrics */}
                <div className="mb-8 grid grid-cols-3 gap-3">
                  {metrics.map((m) => (
                    <div key={m.value} className="rounded-xl border border-zinc-200 bg-slate-50 p-4 text-center">
                      <p className="text-xl font-bold leading-tight text-purple-600">{m.value}</p>
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
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-contain"
                          priority={idx === 0}
                          unoptimized
                        />
                      </div>
                    ))}
                    <div className="absolute right-3 top-3 rounded-lg border border-zinc-300 bg-white/80 p-2 backdrop-blur-sm">
                      <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    {/* Slide label */}
                    <div className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white">
                      {heroSlides[heroSlide].title}
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
                      className={`h-2 rounded-full transition-all ${i === heroSlide ? "w-6 bg-purple-500" : "w-2 bg-zinc-300"}`}
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
              Hard Problems. Deliberate Solutions.
            </p>
            <h2 className="mb-3 text-3xl font-bold text-zinc-900 md:text-4xl">
              Why Healthcare SaaS Is Architecturally Unforgiving
            </h2>
            <p className="mb-12 max-w-xl text-zinc-500">
              Every design decision had patient data, legal compliance, or clinical
              accuracy on the line. Here's what I was up against.
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

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
  purple:  { tag: "bg-purple-50 text-purple-600 border-purple-200",   dot: "bg-purple-400",  metric: "text-purple-600",  border: "border-purple-200" },
  indigo:  { tag: "bg-indigo-50 text-indigo-600 border-indigo-200",   dot: "bg-indigo-400",  metric: "text-indigo-600",  border: "border-indigo-200" },
  teal:    { tag: "bg-teal-50 text-teal-600 border-teal-200",         dot: "bg-teal-400",    metric: "text-teal-600",    border: "border-teal-200" },
  emerald: { tag: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400", metric: "text-emerald-600", border: "border-emerald-200" },
  cyan:    { tag: "bg-cyan-50 text-cyan-600 border-cyan-200",         dot: "bg-cyan-400",    metric: "text-cyan-600",    border: "border-cyan-200" },
};

const FeatureSection: React.FC<FeatureProps> = ({
  tag, title, subtitle, body, highlights, impact, images, accentColor, isOdd,
}) => {
  const [imgIdx, setImgIdx] = useState(0);
  const accent = accentMap[accentColor] ?? accentMap.purple;

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
              <Image
                src={src}
                alt={`${title} ${idx + 1}`}
                fill
                className="object-contain"
                sizes="(min-width: 768px) 50vw, 100vw"
                unoptimized
              />
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
            <p className={`text-lg font-bold leading-tight ${accent.metric}`}>{i.value}</p>
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

export default EyeCareSaaSShowcase;
