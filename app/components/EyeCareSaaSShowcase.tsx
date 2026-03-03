"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EyeCareSaaSShowcase: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const [dashboardSlide, setDashboardSlide] = useState(0);

  const dashboardSlides = [
    {
      title: "Secure Login Interface",
      image: "/eyecare/login.png",
    },
    {
      title: "Organization Registration",
      image: "/eyecare/registration.png",
    },
    {
      title: "Branch Management",
      image: "/eyecare/branch-select.png",
    },
    {
      title: "Prescription Form",
      image: "/eyecare/prescriptionform.png",
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
            <span className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-teal-300/40 blur-[100px] animate-pulse" />
            <span
              className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-cyan-300/30 blur-[100px] animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <span
              className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse"
              style={{ animationDelay: "2s" }}
            />
            <span
              className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full bg-purple-500/25 blur-[100px] animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
          <div
            className="absolute inset-0 bg-slate-50/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div className="max-w-4xl w-full text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6">
              Multi-Tenancy Eye Care Practice Management SaaS
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-12">
              Enterprise-Grade Healthcare SaaS Platform Powered by .NET ASP &
              React.js
            </p>

            {/* Impact Metrics Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">Multi-Tenant</span> Architecture
                </p>
              </div>
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">Unlimited</span> Branches per Org
                </p>
              </div>
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">HIPAA</span> Compliant Data
                </p>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <div className="px-4 py-2 bg-purple-300/30 backdrop-blur border border-purple-500/40 rounded-full">
                <p className="text-purple-700 text-sm font-semibold">
                  .NET ASP Backend
                </p>
              </div>
              <div className="px-4 py-2 bg-cyan-300/30 backdrop-blur border border-cyan-500/40 rounded-full">
                <p className="text-cyan-700 text-sm font-semibold">
                  React Frontend
                </p>
              </div>
              <div className="px-4 py-2 bg-blue-500/20 backdrop-blur border border-blue-500/40 rounded-full">
                <p className="text-blue-700 text-sm font-semibold">
                  PostgreSQL Database
                </p>
              </div>
              <div className="px-4 py-2 bg-teal-300/30 backdrop-blur border border-teal-300 rounded-full">
                <p className="text-teal-700 text-sm font-semibold">
                  Digital Ocean Infrastructure
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
                          unoptimized
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
              Enterprise Architecture & Solutions
            </h2>
            <p className="text-xl text-gray-400">
              Building scalable healthcare SaaS with tenant isolation and data
              security
            </p>
          </div>
        </section>

        {/* FEATURE 1: MULTI-TENANCY ARCHITECTURE */}
        <FeatureShowcase
          isOdd={true}
          title="Multi-Tenancy Architecture"
          subtitle="Raw-Level Tenant Isolation with .NET Middleware for Cost-Efficient Scaling"
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
                    The SaaS Infrastructure Challenge
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      Critical Decision
                    </span>
                  </h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          Separate database per clinic
                        </span>{" "}
                        would cost $50-100/month per organization—unaffordable
                        at early stage growth
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          Shared database without isolation
                        </span>{" "}
                        risks data leakage between organizations—HIPAA
                        compliance nightmare
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          Healthcare data security requirements
                        </span>{" "}
                        demand absolute tenant isolation—one mistake exposes
                        sensitive medical records
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-black/30 rounded-lg border border-red-500/20">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="text-red-300 font-semibold">
                        Engineering Challenge:
                      </span>{" "}
                      Build enterprise-grade multi-tenancy that ensures complete
                      data isolation while keeping infrastructure costs
                      predictable for sustainable SaaS economics.
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-blue-400 font-semibold text-lg mb-2">
                    The Solution: .NET Tenant Isolation Middleware
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Implemented{" "}
                    <span className="text-blue-700 font-semibold">
                      row-level tenant isolation
                    </span>{" "}
                    using custom .NET middleware that automatically filters all
                    database queries by organization ID. Every API request
                    passes through tenant identification middleware, ensuring{" "}
                    <span className="text-green-400 font-semibold">
                      zero cross-organization data leakage
                    </span>{" "}
                    while maintaining single-database cost efficiency.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-700 rounded-full font-semibold">
                      .NET ASP Middleware
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full font-semibold">
                      Row-Level Security
                    </span>
                    <span className="px-3 py-1 bg-purple-300/30 text-purple-700 rounded-full font-semibold">
                      Entity Framework Filters
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
          features={[
            "Custom .NET middleware identifying tenant from JWT claims—organization ID extracted from every authenticated request",
            "Entity Framework global query filters automatically injecting tenant scope—impossible to query cross-organization data",
            "Organization signup with instant provisioning—new clinics onboarded in seconds without infrastructure changes",
            "Unlimited branches per organization based on pricing tier—flexible growth without architectural limits",
            "Usercode + password quick authentication—faster than email/password for daily clinical workflow",
          ]}
          impact={[
            {
              metric: "$0",
              description: "Additional cost per new organization",
            },
            { metric: "100%", description: "Data isolation guarantee" },
            { metric: "Instant", description: "Organization provisioning" },
          ]}
          imageSources={["/eyecare/login.png", "/eyecare/registration.png"]}
          imagePlaceholder="Multi-Tenancy Architecture"
          imageIcon="🔐"
          sectionId="feature-1"
          visibleSections={visibleSections}
        />

        {/* FEATURE 2: BRANCH-WISE ACCESS CONTROL */}
        <FeatureShowcase
          isOdd={false}
          title="Branch-Wise User Access Control"
          subtitle="Granular Permission System for Multi-Location Clinical Operations"
          technicalCallout={
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="text-purple-400 font-semibold text-base mb-2 flex items-center gap-2">
                    Security Architecture
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-300/30 text-purple-700">
                      Enterprise Feature
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
                          Cascading Access Rules:
                        </span>{" "}
                        Organization → Branch → User mapping ensures staff only
                        access authorized locations—critical for multi-branch
                        clinics with rotating employees.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-green-400 flex-shrink-0 mt-1"
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
                        <span className="text-green-400 font-medium">
                          API-Level Enforcement:
                        </span>{" "}
                        Authorization middleware validates branch access on
                        every request—frontend restrictions backed by backend
                        security preventing unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          features={[
            "Branch selection interface showing only authorized locations—users see filtered branch list based on permissions",
            "Admin dashboard for assigning branch access per user—drag-and-drop interface for managing multi-location staff",
            "Role-based permissions within each branch—receptionist, doctor, manager roles with distinct capabilities",
            "Session-based branch context—selected branch persists across application ensuring data consistency",
            "Audit trail of branch access changes—compliance reporting showing who had access to which locations when",
          ]}
          impact={[
            {
              metric: "Zero",
              description: "Unauthorized branch access incidents",
            },
            {
              metric: "Flexible",
              description: "Multi-location staff management",
            },
            { metric: "Complete", description: "Access audit trail" },
          ]}
          imageSources={[
            "/eyecare/branch-select.png",
            "/eyecare/userroles-branchwise-acess.png",
          ]}
          imagePlaceholder="Branch Access Control"
          imageIcon="🏢"
          sectionId="feature-2"
          visibleSections={visibleSections}
        />

        {/* FEATURE 3: BRANCH-WISE INVENTORY MANAGEMENT */}
        <FeatureShowcase
          isOdd={true}
          title="Branch-Wise Inventory Management"
          subtitle="Multi-Location Stock Control for Frames, Lenses & Factory Orders"
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-orange-400 font-semibold text-lg mb-3 flex items-center gap-2">
                    Multi-Branch Inventory Chaos
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-700">
                      Operational Crisis
                    </span>
                  </h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold mt-0.5">
                        •
                      </span>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          Each branch with independent stock
                        </span>{" "}
                        but no visibility into other locations—customers told
                        "out of stock" while other branches have excess
                        inventory
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold mt-0.5">
                        •
                      </span>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          Complex lens variants
                        </span>{" "}
                        (power, cylinder, axis, coating types)—manual tracking
                        causing costly ordering mistakes
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold mt-0.5">
                        •
                      </span>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          External factory orders disconnected
                        </span>{" "}
                        from inventory system—no automated reorder points or
                        tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          features={[
            "Branch-isolated inventory with real-time stock levels—frames, lenses, accessories tracked per location",
            "Multi-variant lens management (power, cylinder, axis, coating, material)—complex SKU handling for optical products",
            "External factory lens ordering integration—automated purchase orders when custom prescriptions needed",
            "Frame variant tracking (size, color, brand, model)—complete product catalog per branch",
            "Stock transfer workflow between branches—move excess inventory to high-demand locations",
            "Low stock alerts per branch—automated notifications preventing customer-facing stockouts",
          ]}
          impact={[
            {
              metric: "Real-time",
              description: "Multi-branch stock visibility",
            },
            { metric: "Automated", description: "Factory order management" },
            { metric: "Zero", description: "Variant tracking errors" },
          ]}
          imageSources={["/eyecare/stock.png"]}
          imagePlaceholder="Inventory Management System"
          imageIcon="📦"
          sectionId="feature-3"
          visibleSections={visibleSections}
        />

        {/* FEATURE 4: MEDICAL PRESCRIPTION FORM */}
        <FeatureShowcase
          isOdd={false}
          title="Validated Medical Prescription Forms"
          subtitle="Zod + React Hook Form + .NET API Triple-Layer Validation"
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
                    Medical Data Validation Architecture
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-300">
                      Safety Critical
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
                          Frontend: Zod Schema + React Hook Form
                        </span>{" "}
                        provides instant validation feedback—SPH range (-20 to
                        +20), CYL/Axis combinations, PD measurements validated
                        on keystroke.
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
                          Backend: .NET ASP Data Annotations + FluentValidation
                        </span>{" "}
                        double-checks every submission—never trust client-side
                        validation for medical data integrity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          features={[
            "Zod schema validation enforcing optical prescription rules—SPH, CYL, Axis, ADD, PD value ranges validated live",
            "React Hook Form managing complex form state—nested field arrays for multiple prescriptions per patient",
            ".NET ASP API validation mirroring frontend rules—comprehensive server-side validation preventing malicious input",
            "Prescription number auto-increment per branch—unique identifiers for audit trail and legal compliance",
            "Doctor signature capture integration—digital signatures for prescription authorization",
            "Prescription history timeline—track changes over time for patient vision monitoring",
          ]}
          impact={[
            { metric: "Zero", description: "Invalid prescription submissions" },
            { metric: "Triple", description: "Layer validation security" },
            { metric: "100%", description: "Medical data integrity" },
          ]}
          imageSources={["/eyecare/prescriptionform.png"]}
          imagePlaceholder="Prescription Form Validation"
          imageIcon="📋"
          sectionId="feature-4"
          visibleSections={visibleSections}
        />

        {/* FEATURE 5: PATIENT MANAGEMENT & QUICK INVOICING */}
        <FeatureShowcase
          isOdd={true}
          title="Patient Management & Prescription-Based Invoicing"
          subtitle="Quick Registration, Long-Term History Tracking & Intelligent Lens Filtering"
          solutionOverview={
            <div className="grid md:grid-cols-2 gap-4 mb-8">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-cyan-400 font-semibold">
                    Quick Patient Registration
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  <span className="text-cyan-700 font-semibold">
                    Streamlined intake form
                  </span>{" "}
                  capturing essential demographics—name, contact, insurance—in
                  under 30 seconds for walk-in efficiency
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-5 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h4 className="text-green-400 font-semibold">
                    Prescription-To-Invoice Flow
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  <span className="text-green-300 font-semibold">
                    Auto-populate lens requirements
                  </span>{" "}
                  from prescription data—intelligent filtering suggests matching
                  inventory based on SPH/CYL values
                </p>
              </div>
            </div>
          }
          features={[
            "Patient registration with duplicate detection—prevents multiple records for same individual",
            "Comprehensive patient profile storing demographic, insurance, medical history—single source of truth",
            "Long-term order history tracking—view all purchases, prescriptions, appointments per patient",
            "Prescription history timeline—monitor vision changes over years for clinical decision support",
            "Quick invoicing interface pre-filled from prescription—SPH/CYL automatically filter matching lens inventory",
            "Lens filtering matching prescription specs—system suggests correct power, cylinder, axis products",
            "Any inventory item can be added to invoice—flexible billing for frames, accessories, services",
          ]}
          impact={[
            { metric: "<30 sec", description: "Patient registration time" },
            { metric: "Instant", description: "Prescription-to-invoice flow" },
            { metric: "Complete", description: "Long-term patient history" },
          ]}
          imageSources={[
            "/eyecare/patient-register.png",
            "/eyecare/factory-order.png",
            "/eyecare/lensfilter.png",
          ]}
          imagePlaceholder="Patient & Invoicing System"
          imageIcon="👥"
          sectionId="feature-5"
          visibleSections={visibleSections}
        />

        {/* ARCHITECTURE SECTION */}
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
              Technical Stack & Architecture Decisions
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 rounded-xl border border-blue-500/20">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">
                  Backend: .NET ASP Core
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Custom Multi-Tenancy Middleware
                      </p>
                      <p className="text-sm text-gray-400">
                        Automatic tenant identification and database query
                        filtering using Entity Framework global filters
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        RESTful API Architecture
                      </p>
                      <p className="text-sm text-gray-400">
                        Clean separation of concerns with repository pattern and
                        dependency injection
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        FluentValidation + Data Annotations
                      </p>
                      <p className="text-sm text-gray-400">
                        Comprehensive server-side validation ensuring medical
                        data integrity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        JWT Authentication & Authorization
                      </p>
                      <p className="text-sm text-gray-400">
                        Stateless token-based auth with role and branch-level
                        claims
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 p-8 rounded-xl border border-cyan-500/20">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                  Frontend: React.js
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Zod Schema Validation
                      </p>
                      <p className="text-sm text-gray-400">
                        Type-safe runtime validation for medical forms
                        preventing invalid data entry
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        React Hook Form
                      </p>
                      <p className="text-sm text-gray-400">
                        Performant form state management with minimal re-renders
                        and complex nested fields
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Context API + React Query
                      </p>
                      <p className="text-sm text-gray-400">
                        Global state management for tenant/branch context with
                        optimistic updates and caching
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                    <div>
                      <p className="text-zinc-900 font-semibold">
                        Component-Driven Architecture
                      </p>
                      <p className="text-sm text-gray-400">
                        Reusable UI components with TypeScript type safety for
                        medical domain models
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">
                Key Architectural Decisions
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <p className="leading-relaxed">
                    <span className="text-blue-400 font-semibold">
                      Multi-Tenancy Over Separate Databases:
                    </span>{" "}
                    Chose row-level isolation with middleware enforcement to
                    maintain single-database simplicity while ensuring
                    enterprise-grade security—reducing infrastructure costs by
                    90% compared to database-per-tenant approach.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <p className="leading-relaxed">
                    <span className="text-green-400 font-semibold">
                      Triple-Layer Validation:
                    </span>{" "}
                    Medical data demands paranoid validation—Zod catches UX
                    errors instantly, React Hook Form prevents form submission
                    with invalid state, .NET ASP validates again because never
                    trust client-side for healthcare data.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                  <p className="leading-relaxed">
                    <span className="text-purple-400 font-semibold">
                      Branch Context in JWT Claims:
                    </span>{" "}
                    Embedding branch permissions in authentication tokens
                    eliminates database lookups on every authorization
                    check—faster API responses while maintaining security.
                  </p>
                </div>
              </div>
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
                title="Backend"
                skills={[
                  ".NET ASP Core",
                  "Multi-Tenancy Middleware",
                  "Entity Framework",
                  "JWT Authentication",
                  "RESTful API Design",
                  "Data Validation",
                ]}
                color="blue"
              />
              <SkillCategory
                title="Frontend"
                skills={[
                  "React.js",
                  "TypeScript",
                  "Zod Validation",
                  "React Hook Form",
                  "React Query",
                  "Component Architecture",
                ]}
                color="cyan"
              />
              <SkillCategory
                title="Healthcare SaaS"
                skills={[
                  "HIPAA Compliance",
                  "Medical Data Security",
                  "Multi-Branch Operations",
                  "Clinical Workflows",
                  "Prescription Management",
                  "Audit Trail Implementation",
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

export default EyeCareSaaSShowcase;
