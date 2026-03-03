"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const POSSaaSShowcase: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const [dashboardSlide, setDashboardSlide] = useState(0);

  const dashboardSlides = [
    {
      title: "POS Dashboard",
      image: "/pos/poshome.png",
    },
    {
      title: "Auto Backup System",
      image: "/pos/backupautosingup.png",
    },
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <PhotoProvider>
      <div
        id="showcase-container"
        className="w-full bg-slate-50 text-zinc-900"
      >
        {/* HERO SECTION */}
        <section
          id="hero"
          data-animate
          className={`relative min-h-[600px] bg-slate-50 flex items-center justify-center px-6 py-20 transform transition-all duration-1000 overflow-hidden ${
            visibleSections.has("hero")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Background Orbs */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <span className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-300/40 blur-[100px] animate-pulse" />
            <span
              className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-purple-300/30 blur-[100px] animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <span
              className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-cyan-300/30 blur-[100px] animate-pulse"
              style={{ animationDelay: "2s" }}
            />
            <span
              className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-300/30 blur-[100px] animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
          <div
            className="absolute inset-0 bg-slate-50/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div className="max-w-4xl w-full text-centexr relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6">
              Zero-Cost POS SaaS Platform
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12">
              Cloud-Connected Desktop POS System with Monthly Subscription Model
              for Small Retail Business and Startups
            </p>

            {/* Impact Metrics Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">$0</span> Server Hosting Cost
                </p>
              </div>
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">10+</span> Active Retail Shops
                </p>
              </div>
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">Auto</span> Update System
                </p>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <div className="px-4 py-2 bg-blue-500/20 backdrop-blur border border-blue-500/40 rounded-full">
                <p className="text-blue-700 text-sm font-semibold">
                  Electron.js Desktop
                </p>
              </div>
              <div className="px-4 py-2 bg-green-500/20 backdrop-blur border border-green-500/40 rounded-full">
                <p className="text-green-300 text-sm font-semibold">
                  Node.js Backend
                </p>
              </div>
              <div className="px-4 py-2 bg-yellow-500/20 backdrop-blur border border-yellow-500/40 rounded-full">
                <p className="text-yellow-700 text-sm font-semibold">
                  MySQL/PostgreSQL
                </p>
              </div>
              <div className="px-4 py-2 bg-orange-500/20 backdrop-blur border border-orange-500/40 rounded-full">
                <p className="text-orange-700 text-sm font-semibold">
                  Hostinger KVM
                </p>
              </div>
            </div>

            {/* Dashboard Carousel Slider */}
            <div className="mx-auto max-w-3xl">
              <div className="relative">
                {/* Slide Container */}
                <PhotoView src={dashboardSlides[dashboardSlide].image}>
                  <div className="relative h-96 bg-black rounded-xl border border-gray-600 overflow-hidden cursor-zoom-in hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all group">
                    {dashboardSlides.map((slide, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          idx === dashboardSlide ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-contain"
                          priority={idx === 0}
                        />
                      </div>
                    ))}
                    {/* Fullscreen Icon Overlay */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-2.5 rounded-lg border border-zinc-300 transition-all duration-300 pointer-events-none group-hover:scale-110">
                      <svg
                        className="w-5 h-5 text-zinc-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                    </div>
                  </div>
                </PhotoView>

                {/* Navigation Buttons */}
                <button
                  onClick={() =>
                    setDashboardSlide((prev) =>
                      prev === 0 ? dashboardSlides.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-200 hover:bg-white/40 text-zinc-900 p-3 rounded-full transition-all backdrop-blur"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setDashboardSlide((prev) =>
                      prev === dashboardSlides.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-200 hover:bg-white/40 text-zinc-900 p-3 rounded-full transition-all backdrop-blur"
                >
                  →
                </button>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {dashboardSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDashboardSlide(idx)}
                      className={`h-3 rounded-full transition-all ${
                        idx === dashboardSlide
                          ? "w-8 bg-white"
                          : "w-3 bg-gray-500 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES & PROBLEMS SOLVED SECTION */}
        <section className="py-12 px-6 bg-slate-50 border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
              Innovation & Architecture
            </h2>
            <p className="text-xl text-gray-400">
              Disrupting traditional POS pricing with cloud-native architecture
            </p>
          </div>
        </section>

        {/* FEATURE 1: CLOUD BACKUP SYSTEM */}
        <FeatureShowcase
          isOdd={true}
          title="Zero-Cost Cloud Backup System"
          subtitle="Google Drive Integration Eliminating Server Hosting Fees"
          problemCallout={
            <div className="mb-8 p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-semibold text-lg mb-3 flex items-center gap-2">
                    The Startup Killer Problem
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      Critical Barrier
                    </span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          $50-200/month server costs
                        </span>{" "}
                        making POS systems unaffordable for small startups
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          Cloud-only systems
                        </span>{" "}
                        requiring constant internet—failing during network
                        outages
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          Manual backup processes
                        </span>{" "}
                        leading to data loss during hardware failures
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          Expensive per-terminal licensing
                        </span>{" "}
                        preventing business scaling
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-black/30 rounded-lg border border-red-500/20">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="text-red-300 font-semibold">
                        Market Reality:
                      </span>{" "}
                      Small retail shops with tight margins couldn't justify
                      $600-2,400 annual server costs. They needed enterprise
                      features at startup-friendly pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
          solutionOverview={
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-500/20 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-blue-400 font-semibold text-lg mb-2">
                    The Breakthrough Architecture
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Built an{" "}
                    <span className="text-blue-700 font-semibold">
                      Electron.js desktop application
                    </span>{" "}
                    that stores data locally (zero server dependency) while
                    automatically backing up to the user's{" "}
                    <span className="text-green-400 font-semibold">
                      own Google Drive account
                    </span>
                    . Subscription validation happens via lightweight Node.js
                    Express API—costing pennies per month instead of expensive
                    database hosting.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-700 rounded-full font-semibold">
                      Offline-First
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full font-semibold">
                      Zero Hosting Cost
                    </span>
                    <span className="px-3 py-1 bg-purple-300/30 text-purple-700 rounded-full font-semibold">
                      Auto-Updates via GitHub
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
          features={[
            "Automatic backup to user's Google Drive on logout—data encrypted, zero server storage needed",
            "Backup history tracking showing all sync points with restore capability for data recovery",
            "JWT token subscription verification checking expiry dates and sending renewal reminders",
            "GitHub Releases integration for automatic app updates—all 10+ shops update simultaneously",
            "Offline-capable: Works without internet, syncs when connection restored",
          ]}
          impact={[
            {
              metric: "$0/mo",
              description: "Server hosting cost vs $50-200 competitors",
            },
            { metric: "10+ shops", description: "Since December 2024" },
            { metric: "100%", description: "Update deployment rate" },
          ]}
          imageSources={["/pos/backupautosingup.png", "/pos/backuphistory.png"]}
          imagePlaceholder="Cloud Backup System"
          imageIcon="☁️"
          sectionId="feature-1"
          visibleSections={visibleSections}
        />

        {/* FEATURE 2: SMART INVENTORY MANAGEMENT */}
        <FeatureShowcase
          isOdd={false}
          title="Multi-Variant Inventory System"
          subtitle="Barcode-Enabled Product Management with Unit & Measurement Support"
          technicalCallout={
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-green-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="text-green-400 font-semibold text-base mb-2 flex items-center gap-2">
                    Innovation Highlight
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-300">
                      Unique Feature
                    </span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        <span className="text-blue-400 font-medium">
                          Dual Invoicing Modes:
                        </span>{" "}
                        Support both unit-based (pieces, boxes) and
                        measurement-based (kg, ml, meters) products in the same
                        invoice—critical for general stores.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        <span className="text-purple-400 font-medium">
                          Multi-Variant SKUs:
                        </span>{" "}
                        Single product can have multiple variants (sizes,
                        colors, packaging) each with unique barcode and
                        individual cost tracking for accurate profit margins.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          features={[
            "Multiple product variants with individual barcodes—size, color, packaging variations tracked separately",
            "Unit & measurement-based invoicing (pieces, kg, ml, meters)—flexible for diverse inventory types",
            "Automatic cost tracking per variant for precise profit margin calculation on each sale",
            "Low stock alerts with customizable thresholds preventing stockouts and lost sales",
            "Barcode label printer integration for quick product labeling and efficient shelf management",
          ]}
          impact={[
            {
              metric: "Instant",
              description: "Variant lookup via barcode scan",
            },
            {
              metric: "Dual-mode",
              description: "Unit + Measurement invoicing",
            },
            { metric: "Real-time", description: "Low stock alerts" },
          ]}
          imageSources={["/pos/inventory.png", "/pos/lableprint.png"]}
          imagePlaceholder="Inventory Management Interface"
          imageIcon="📦"
          sectionId="feature-2"
          visibleSections={visibleSections}
        />

        {/* FEATURE 3: RAPID INVOICING SYSTEM */}
        <FeatureShowcase
          isOdd={true}
          title="Lightning-Fast POS Interface"
          subtitle="Keyboard-Driven Workflow with Barcode Scanning & Auto-Focus"
          forceVisible={true}
          problemCallout={
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-l-4 border-orange-500 rounded-r-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-orange-400 font-semibold text-lg mb-3 flex items-center gap-2">
                    Speed is Revenue
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-700">
                      UX Innovation
                    </span>
                  </h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold mt-0.5">
                        •
                      </span>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          30-45 second invoice time
                        </span>{" "}
                        in traditional POS systems slowing checkout—customers
                        waiting, reducing throughput
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold mt-0.5">
                        •
                      </span>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          Mouse-dependent workflows
                        </span>{" "}
                        forcing cashiers to constantly switch between keyboard
                        and mouse—friction in every action
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-black/30 rounded-lg border border-orange-500/20">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="text-orange-700 font-semibold">
                        Design Philosophy:
                      </span>{" "}
                      Every second saved per invoice multiplies across hundreds
                      of daily transactions. Built keyboard-first interface
                      enabling experienced cashiers to invoice without touching
                      the mouse.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
          solutionOverview={
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-5 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-300/30 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <h4 className="text-purple-400 font-semibold">
                    Keyboard Shortcuts
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  <span className="text-purple-700 font-semibold">
                    Complete keyboard control
                  </span>{" "}
                  with shortcuts for add item, remove, discount, payment,
                  print—enabling mouse-free invoicing workflow
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-5 rounded-xl border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-300/30 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-cyan-400 font-semibold">
                    Smart Auto-Focus
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  <span className="text-cyan-700 font-semibold">
                    Input auto-focusing
                  </span>{" "}
                  anticipating next action—scan barcode, quantity auto-selected,
                  amount field auto-focused—seamless flow
                </p>
              </div>
            </div>
          }
          features={[
            "Dual search modes: Barcode scanning + name search—find products instantly either way",
            "Keyboard shortcuts for all actions (F1-Add, F2-Remove, F3-Discount, F4-Payment)—zero mouse dependency",
            "Auto-focus relevant inputs predicting next action—barcode→quantity→amount flow optimization",
            "Low stock alerts displayed during invoicing—preventing sale of out-of-stock items",
            "One-click print with automatic receipt formatting and cash drawer integration",
          ]}
          impact={[
            {
              metric: "5-10 sec",
              description: "Average invoice completion time",
            },
            { metric: "Zero", description: "Mouse clicks required" },
            { metric: "100%", description: "Keyboard-driven workflow" },
          ]}
          imageSources={["/pos/posui.png"]}
          imagePlaceholder="POS Interface"
          imageIcon="⚡"
          sectionId="feature-3"
          visibleSections={visibleSections}
        />

        {/* FEATURE 4: PROFIT ANALYTICS */}
        <FeatureShowcase
          isOdd={false}
          title="Comprehensive Invoice Analytics"
          subtitle="Cost, Profit & Sales Reports with Date-Range Filtering"
          features={[
            "Invoice reports showing total sales, cost of goods sold (COGS), and profit margins per transaction",
            "Date-wise filtering for daily, weekly, monthly performance analysis tracking trends over time",
            "Total items sold breakdown revealing best-selling products and slow movers for inventory optimization",
            "Profit margin visualization per invoice highlighting high-margin vs low-margin sales patterns",
            "Exportable reports for accounting integration and tax filing simplification",
          ]}
          impact={[
            {
              metric: "Real-time",
              description: "Profit calculation per invoice",
            },
            { metric: "Item-level", description: "Cost tracking accuracy" },
            { metric: "Date-range", description: "Performance analytics" },
          ]}
          imageSources={["/pos/invoicereport.png"]}
          imagePlaceholder="Analytics Dashboard"
          imageIcon="📊"
          sectionId="feature-4"
          visibleSections={visibleSections}
        />

        {/* ARCHITECTURE & IMPACT */}
        <section
          id="architecture"
          data-animate
          className={`py-20 px-6 bg-gray-900 transform transition-all duration-1000 ${
            visibleSections.has("architecture")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-zinc-900 mb-16 text-center">
              Technical Architecture & Business Impact
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 rounded-xl border border-blue-500/20">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">
                  Tech Stack
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Electron.js Desktop App
                      </p>
                      <p className="text-sm text-gray-400">
                        Cross-platform native application with offline-first
                        architecture
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Node.js Express Backend
                      </p>
                      <p className="text-sm text-gray-400">
                        Lightweight API for JWT subscription validation—minimal
                        server load
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        MySQL & PostgreSQL Database
                      </p>
                      <p className="text-sm text-gray-400">
                        Dual database support for flexible data storage with
                        ACID compliance and high availability options
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Hostinger KVM Hosting
                      </p>
                      <p className="text-sm text-gray-400">
                        Dedicated KVM server providing reliable infrastructure
                        with cost-effective pricing and predictable performance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Google Drive API Integration
                      </p>
                      <p className="text-sm text-gray-400">
                        Automated backup using user's own cloud storage—zero
                        hosting cost
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        GitHub Releases Auto-Update
                      </p>
                      <p className="text-sm text-gray-400">
                        Push update once, all installations update automatically
                        on next launch
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8 rounded-xl border border-green-500/20">
                <h3 className="text-2xl font-bold text-green-400 mb-6">
                  Real-World Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        10+ Retail Shops Active
                      </p>
                      <p className="text-sm text-gray-400">
                        Since December 2024—stable production environment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        $0 Monthly Server Cost
                      </p>
                      <p className="text-sm text-gray-400">
                        vs $50-200 traditional POS hosting—100% cost elimination
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Seamless Update Deployment
                      </p>
                      <p className="text-sm text-gray-400">
                        100% adoption rate—all users get updates automatically
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Subscription Model Success
                      </p>
                      <p className="text-sm text-gray-400">
                        JWT token validation with automated renewal
                        reminders—predictable revenue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">
                Key Innovation: Disrupting POS Economics
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Traditional POS systems charge $50-200/month for cloud hosting
                because they store all business data centrally. I eliminated
                this cost entirely by building an{" "}
                <span className="text-blue-400 font-semibold">
                  Electron desktop app that stores data locally
                </span>{" "}
                and backs up to the{" "}
                <span className="text-green-400 font-semibold">
                  user's own Google Drive
                </span>
                .
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                The backend is just a lightweight{" "}
                <span className="text-purple-400 font-semibold">
                  Node.js Express API
                </span>{" "}
                that validates subscription status via JWT tokens—costing
                pennies instead of expensive database hosting. Updates are
                distributed via{" "}
                <span className="text-orange-400 font-semibold">
                  GitHub Releases
                </span>
                , with the app auto-checking and installing updates on launch.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This architecture makes enterprise-grade POS accessible to small
                startups that couldn't afford traditional
                solutions—democratizing technology for businesses that need it
                most.
              </p>
            </div>
          </div>
        </section>

        {/* SKILLS DEMONSTRATED */}
        <section
          id="skills"
          data-animate
          className={`py-20 px-6 bg-slate-50 transform transition-all duration-1000 ${
            visibleSections.has("skills")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-zinc-900 mb-16 text-center">
              Skills Demonstrated
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              <SkillCategory
                title="Architecture"
                skills={[
                  "Electron.js Desktop Apps",
                  "Offline-First Design",
                  "Cloud Integration",
                  "Auto-Update Systems",
                  "JWT Authentication",
                  "Cost Optimization",
                ]}
                color="blue"
              />
              <SkillCategory
                title="Full-Stack"
                skills={[
                  "Node.js + Express",
                  "React Desktop UI",
                  "Google Drive API",
                  "Database Design",
                  "Barcode Integration",
                  "Print Management",
                ]}
                color="cyan"
              />
              <SkillCategory
                title="Product"
                skills={[
                  "Market Gap Analysis",
                  "Pricing Innovation",
                  "UX Optimization",
                  "SaaS Business Model",
                  "Customer Deployment",
                  "Production Support",
                ]}
                color="purple"
              />
            </div>
          </div>
        </section>
      </div>
    </PhotoProvider>
  );
};

// FEATURE SHOWCASE COMPONENT
type FeatureShowcaseProps = {
  isOdd: boolean;
  title: string;
  subtitle: string;
  features: string[];
  impact: Array<{ metric: string; description: string }>;
  imagePlaceholder: string;
  imageIcon: string;
  imageSources?: string[];
  problemCallout?: React.ReactNode;
  solutionOverview?: React.ReactNode;
  technicalCallout?: React.ReactNode;
  forceVisible?: boolean;
  sectionId: string;
  visibleSections: Set<string>;
};

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  isOdd,
  title,
  subtitle,
  features,
  impact,
  imagePlaceholder,
  imageIcon,
  imageSources = [],
  problemCallout,
  solutionOverview,
  technicalCallout,
  forceVisible = false,
  sectionId,
  visibleSections,
}) => {
  const [imageIndex, setImageIndex] = React.useState(0);
  const isVisible = forceVisible || visibleSections.has(sectionId);

  React.useEffect(() => {
    if (imageSources.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % imageSources.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [imageSources.length]);

  return (
    <section
      id={sectionId}
      data-animate
      className={`py-20 px-6 bg-gray-900 transform transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } hover:shadow-[0_-10px_30px_rgba(0,0,0,0.3)] transition-all`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`grid md:grid-cols-2 gap-12 items-center ${
            !isOdd ? "md:grid-flow-dense" : ""
          }`}
        >
          {/* IMAGE SIDE */}
          <div
            className={`${isOdd ? "md:col-span-1" : "md:order-2 md:col-span-1"}`}
          >
            {imageSources.length > 0 ? (
              <div className="relative">
                <PhotoView src={imageSources[imageIndex] || imageSources[0]}>
                  <div className="w-full h-96 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-gray-600 flex items-center justify-center hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all cursor-zoom-in hover:scale-105 group">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                      {imageSources.map((src, idx) => (
                        <div
                          key={src}
                          className={`absolute inset-0 transition-opacity duration-700 ${
                            idx === imageIndex ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <Image
                            src={src}
                            alt={`${title} screen ${idx + 1}`}
                            fill
                            className="object-contain"
                            sizes="(min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      ))}
                      {/* Fullscreen Icon Overlay */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-2.5 rounded-lg border border-zinc-300 transition-all duration-300 pointer-events-none group-hover:scale-110">
                        <svg
                          className="w-5 h-5 text-zinc-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                      </div>
                      {/* Image Counter */}
                      <div className="absolute bottom-3 right-4 text-xs text-zinc-900/80 bg-black/40 px-2 py-1 rounded-full">
                        {imageIndex + 1}/{imageSources.length}
                      </div>
                    </div>
                  </div>
                </PhotoView>

                {/* Navigation Arrows */}
                {imageSources.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageIndex((prev) =>
                          prev === 0 ? imageSources.length - 1 : prev - 1,
                        );
                      }}
                      className="absolute -left-12 top-1/2 -translate-y-1/2 bg-zinc-200 hover:bg-white/40 text-zinc-900 p-1.5 rounded-full transition-all backdrop-blur z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageIndex((prev) =>
                          prev === imageSources.length - 1 ? 0 : prev + 1,
                        );
                      }}
                      className="absolute -right-12 top-1/2 -translate-y-1/2 bg-zinc-200 hover:bg-white/40 text-zinc-900 p-1.5 rounded-full transition-all backdrop-blur z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-gray-600 flex items-center justify-center hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all">
                <div className="text-center">
                  <div className="text-6xl mb-4">{imageIcon}</div>
                  <p className="text-gray-400 font-medium">
                    {imagePlaceholder}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTENT SIDE */}
          <div
            className={`${isOdd ? "md:col-span-1" : "md:order-1 md:col-span-1"}`}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">
              {title}
            </h3>
            <p className="text-lg text-gray-400 mb-8">{subtitle}</p>

            {problemCallout && <div>{problemCallout}</div>}

            {solutionOverview && <div>{solutionOverview}</div>}

            {technicalCallout && <div>{technicalCallout}</div>}

            {/* Built Section */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-4">
                Built
              </h4>
              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-300">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact Section */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-green-400 mb-4">
                Impact
              </h4>
              <div className="space-y-3">
                {impact.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {item.metric}
                    </div>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// SKILL CATEGORY COMPONENT
const SkillCategory: React.FC<{
  title: string;
  skills: string[];
  color: "blue" | "cyan" | "purple";
}> = ({ title, skills, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-500/30",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-500/30",
    purple: "bg-purple-50 text-purple-700 border-purple-500/30",
  };

  return (
    <div>
      <h4 className="text-lg font-bold text-zinc-900 mb-6">{title}</h4>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-full border ${colorMap[color]} text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default POSSaaSShowcase;
