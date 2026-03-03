"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VisionPlusShowcase: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const [dashboardSlide, setDashboardSlide] = useState(0);

  const dashboardSlides = [
    // {
    //   title: "Patient Management",
    //   image: "/visionplus/factory order.jpeg",
    // },
    // { title: "Appointment Scheduling", image: "/visionplus/orderform.jpeg" },
    // {
    //   title: "Order Tracking",
    //   image: "/visionplus/trackignreport.jpeg",
    // },
    {
      title: "Vision Plus Storefront",
      image: "/visionplus/visionplusfront.jpeg",
    },
    {
      title: "Vision Plus Interior",
      image: "/visionplus/visionplusinventory.jpeg",
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

          <div className="max-w-4xl w-full text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6">
              Vision Plus Eye Clinic Chain ERP System
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12">
              Multi-Branch Eye Care Practice Management Platform
            </p>

            {/* Impact Metrics Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">60%</span> Order Processing Speed
                </p>
              </div>
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">95%</span> Fewer Inventory Errors
                </p>
              </div>
              <div className="px-6 py-3 bg-zinc-200 backdrop-blur border border-zinc-400 rounded-full">
                <p className="text-zinc-900 font-semibold">
                  <span className="text-2xl">100%</span> Order Visibility
                </p>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <div className="px-4 py-2 bg-green-500/20 backdrop-blur border border-green-500/40 rounded-full">
                <p className="text-green-300 text-sm font-semibold">
                  Django Backend
                </p>
              </div>
              <div className="px-4 py-2 bg-cyan-300/30 backdrop-blur border border-cyan-500/40 rounded-full">
                <p className="text-cyan-700 text-sm font-semibold">
                  React Frontend
                </p>
              </div>
              <div className="px-4 py-2 bg-blue-500/20 backdrop-blur border border-blue-500/40 rounded-full">
                <p className="text-blue-700 text-sm font-semibold">
                  MySQL Database
                </p>
              </div>
              <div className="px-4 py-2 bg-indigo-500/20 backdrop-blur border border-indigo-500/40 rounded-full">
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
              Features & Problems Solved
            </h2>
            <p className="text-xl text-gray-400">
              Real-world challenges transformed into elegant solutions
            </p>
          </div>
        </section>

        {/* FEATURE 1: PATIENT REFRACTION TRACKING */}
        <FeatureShowcase
          isOdd={true}
          title="Patient Prescription And Orders Tracking"
          subtitle="Complete Vision History Management"
          technicalCallout={
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="text-red-400 font-semibold text-base mb-2 flex items-center gap-2">
                    Problem Solved
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-300">
                      Critical
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
                          Duplicate Prevention:
                        </span>{" "}
                        NIC and mobile number enforced as unique
                        identifiers--eliminating duplicate patient records that
                        cause prescription errors
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
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        <span className="text-green-400 font-medium">
                          Audit Trail:
                        </span>{" "}
                        Every record change logged with user ID and
                        timestamp--ensuring HIPAA-level medical data protection
                        and accountability
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          features={[
            "NIC/Mobile number/Name instant search",
            "Timeline view of all refraction records & All types of Orders",
            "Prescription Audit logs tracking when changing data",
            "Quick Shortcut to Add Hbrx Value to next prescription",
            "Duplicate patient detection",
          ]}
          impact={[
            { metric: "Instant", description: "Patient lookup time" },
            { metric: "Quick", description: "History retrieval" },
            { metric: "100%", description: "Data accuracy and Fast filtering" },
          ]}
          imagePlaceholder="Patient Search & History Interface"
          imageIcon="👁️"
          imageSources={[
            "/visionplus/patienttracking.png",
            "/visionplus/refractionaudit.png",
          ]}
          sectionId="feature-1"
          visibleSections={visibleSections}
        />

        {/* FEATURE 2: DOCTOR APPOINTMENT CALENDAR */}
        <FeatureShowcase
          isOdd={false}
          title="Doctor Appointment "
          subtitle="Intelligent Scheduling System"
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-semibold text-lg mb-3 flex items-center gap-2">
                    Critical Business Problem
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      Revenue Impact
                    </span>
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          22% no-show rate
                        </span>{" "}
                        costing the clinic significant daily revenue--patients
                        booking appointments but never arriving
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          Doctors waiting idle
                        </span>{" "}
                        while patients are late or stuck in traffic without
                        notifying the clinic
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          Receptionists manually calling
                        </span>{" "}
                        patients after scheduled time--reactive, not preventive
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-zinc-900">
                          No systematic intervention
                        </span>{" "}
                        to rescue appointments before they became lost revenue
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-black/30 rounded-lg border border-red-500/20">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="text-red-300 font-semibold">
                        Real Impact:
                      </span>{" "}
                      With 40+ daily appointments across branches, 22% no-show
                      meant 8-9 lost consultations daily. At average
                      consultation fee, this represented substantial monthly
                      revenue leakage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
          solutionOverview={
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-400"
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
                  <h3 className="text-blue-400 font-semibold text-lg">
                    The Core Insight
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Instead of{" "}
                  <span className="text-red-400 line-through">
                    reacting after patients miss appointments
                  </span>
                  , I built a{" "}
                  <span className="text-green-400 font-semibold">
                    proactive intervention system
                  </span>{" "}
                  that identifies at-risk appointments in real-time and triggers
                  automated rescue actions.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-green-400 font-semibold text-lg">
                    Automated Detection
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  System continuously monitors appointment status every 5
                  minutes. When{" "}
                  <span className="font-mono text-yellow-400 bg-yellow-50 px-1 rounded">
                    scheduled_time == current_time
                  </span>{" "}
                  AND{" "}
                  <span className="font-mono text-yellow-400 bg-yellow-50 px-1 rounded">
                    status != "Arrived"
                  </span>
                  , it immediately flags the appointment and triggers
                  intervention workflow.
                </p>
              </div>
            </div>
          }
          features={[
            "Doctor Arrival Dates are hilited in Red color for quick Filtering",
            "Double-booking prevention with validation",
            "Automatic SMS confirmation on booking",
            "Customized Appointment Filter by doctor & date wise coordination",
            "Patient No Show Detection System with 5-min interval checks",
          ]}
          impact={[
            { metric: "99% fewer", description: "Scheduling conflicts" },
            { metric: "40% more", description: "Appointment capacity" },
            { metric: "95%", description: "Confirmation rate" },
          ]}
          imageSources={["/visionplus/appointment.jpg"]}
          imagePlaceholder="Appointment Scheduling Interface"
          imageIcon="📅"
          sectionId="feature-2"
          visibleSections={visibleSections}
        />

        {/* FEATURE 3: FACTORY ORDER TRACKING */}
        <FeatureShowcase
          isOdd={true}
          title="Orders & Invoicing System"
          subtitle="Multi-Format Order Processing with Financial Controls & Quality Tracking"
          forceVisible={true}
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-semibold text-lg mb-3 flex items-center gap-2">
                    Critical Operational Chaos
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      Revenue Impact
                    </span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          5 order types processed identically
                        </span>{" "}
                        causing staff confusion and processing errors
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          Zero order progress visibility
                        </span>{" "}
                        staff manually calling to check "where is my order?"—no
                        stage tracking
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          Zero advance payment enforcement
                        </span>{" "}
                        tying up clinic capital for weeks
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          No audit trail on edits
                        </span>{" "}
                        enabling fraud and making disputes impossible
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          12% remake rate
                        </span>{" "}
                        from poor quality tracking and customer complaints
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-black/30 rounded-lg border border-red-500/20">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="text-red-300 font-semibold">
                        Financial Impact:
                      </span>{" "}
                      Rs. 675K locked in unpaid held orders, material waste from
                      remakes, and potential fraud from untracked edits costing
                      significantly monthly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
          solutionOverview={
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-5 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-blue-400 font-semibold">
                    5 Specialized Forms
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Created distinct invoice types for{" "}
                  <span className="text-blue-700 font-semibold">
                    Factory / Normal / Frame-Only / Hearing Aid / Soldering
                  </span>
                  —each with tailored fields eliminating confusion
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-5 rounded-xl border border-green-500/20">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-green-400 font-semibold">
                    Payment Controls
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Implemented{" "}
                  <span className="text-green-300 font-semibold">
                    mandatory advance payment gates
                  </span>{" "}
                  and automated hold/reminder system—protecting cash flow and
                  recovering Rs. 5.76M annually
                </p>
              </div>

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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h4 className="text-purple-400 font-semibold">
                    Complete Audit Trail
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every edit, payment, and status change{" "}
                  <span className="text-purple-700 font-semibold">
                    logged with user ID and timestamp
                  </span>
                  —ensuring accountability and preventing fraud
                </p>
              </div>
            </div>
          }
          features={[
            "5 specialized invoice types (Factory/Normal/Frame-Only/Hearing/Soldering) with contextual fields",
            "Order progress tracking with timestamped history: Received from Customer → Issued to Factory → Received from Factory → Issued to Customer",
            "Mandatory advance payment enforcement with auto-hold system for insufficient payments",
            "Complete edit audit trail - every change logged with user ID, timestamp, and old/new values",
            "MNT (remake) tracking system linking remakes to original orders with reason categorization",
            "Held orders dashboard with automated SMS reminders for payment collection",
            "Automated refund calculation for cancelled/remade orders preventing disputes",
          ]}
          impact={[
            { metric: "85%", description: "Processing accuracy improvement" },
            { metric: "72%", description: "Cash flow improvement" },
            { metric: "12% → 4%", description: "Remake rate reduction" },
          ]}
          imageSources={["/visionplus/order.png", "/visionplus/checkin.png"]}
          imagePlaceholder="8-Stage Timeline Interface"
          imageIcon="📊"
          sectionId="feature-3"
          visibleSections={visibleSections}
        />

        {/* FEATURE 4: BRANCH-WISE INVENTORY */}
        <FeatureShowcase
          isOdd={false}
          title="Branch-Wise Inventory Management System"
          subtitle="Real-Time Multi-Location Stock Control with Complete Transfer Traceability"
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-semibold text-lg mb-3 flex items-center gap-2">
                    Multi-Branch Inventory Chaos
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      Critical Operations Issue
                    </span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          Zero stock visibility across 15 branches
                        </span>{" "}
                        causing lost sales (Branch A surplus while B runs out)
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          18% inventory variance
                        </span>{" "}
                        between system and physical count—"ghost inventory"
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          WhatsApp & Excel transfer tracking
                        </span>{" "}
                        creating disputes about who sent what, when
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <p>
                        <span className="font-semibold text-zinc-900">
                          3-day investigation
                        </span>{" "}
                        to trace missing high-value items across locations
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-black/30 rounded-lg border border-red-500/20">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="text-red-300 font-semibold">
                        Financial Impact:
                      </span>{" "}
                      Significant capital tied up in ghost inventory, lost sales
                      from stock-outs at high-demand branches while surplus aged
                      at low-traffic locations.
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-blue-400 font-semibold text-lg mb-2">
                    Forensic-Level Item Tracking
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Built{" "}
                    <span className="text-blue-700 font-semibold">
                      item-level tracking system
                    </span>{" "}
                    where every frame/lens has a complete digital paper trail—
                    <span className="text-red-400 line-through">
                      aggregate stock numbers
                    </span>{" "}
                    replaced with forensic audit trail showing exactly when item
                    entered which branch, who handled it, where it moved, and
                    current status.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-700 rounded-full font-semibold">
                      Real-Time Sync
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full font-semibold">
                      Complete Traceability
                    </span>
                    <span className="px-3 py-1 bg-purple-300/30 text-purple-700 rounded-full font-semibold">
                      Zero Ghost Inventory
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
          features={[
            "Item-level addition tracking with branch, staff ID, timestamp, source (purchase/transfer/return), and product image upload",
            "Categorized removal tracking linking to invoice/transfer/damage report IDs with mandatory reason selection",
            "3-stage transfer workflow (Initiated → In Transit → Received) with complete paper trail and discrepancy handling",
            "6+ comprehensive reports: current stock, addition/removal history, transfer tracking, item lifecycle, variance analysis",
            "Real-time inventory sync across all branches with color-coded alerts (Red: Critical, Yellow: Low, Green: Optimal)",
            "Transfer ID generated for every movement—destination branch SMS notification, elapsed time counter, receipt confirmation required",
          ]}
          impact={[
            {
              metric: "95%",
              description: "Inventory accuracy (18% → <3% variance)",
            },
            {
              metric: "3h → 15min",
              description: "Item location time (92% faster)",
            },
            { metric: "40%", description: "Fewer emergency transfers" },
          ]}
          imageSources={[
            "/visionplus/inventory.png",
            "/visionplus/frametable.png",
          ]}
          imagePlaceholder="Real-Time Stock Dashboard"
          imageIcon="📦"
          sectionId="feature-4"
          visibleSections={visibleSections}
        />

        {/* SKILLS GRID */}
        <section
          id="skills"
          data-animate
          className={`py-20 px-6 bg-gray-900 transform transition-all duration-1000 ${
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
                title="UX/UI Design"
                skills={[
                  "User Research",
                  "Information Architecture",
                  "Wireframing",
                  "Design Systems",
                  "Responsive Design",
                  "Accessibility Compliance",
                  "Prototype Testing",
                ]}
                color="blue"
              />
              <SkillCategory
                title="Technical"
                skills={[
                  "Full-Stack Development",
                  "Database Design",
                  "API Development",
                  "Real-Time Sync",
                  "Image Processing",
                  "Report Generation",
                  "Authentication & Security",
                ]}
                color="cyan"
              />
              <SkillCategory
                title="Business"
                skills={[
                  "Requirements Gathering",
                  "Process Optimization",
                  "Stakeholder Management",
                  "ROI Analysis",
                  "Change Management",
                  "User Training",
                  "Project Leadership",
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

// TECH CARD COMPONENT
const TechCard: React.FC<{
  icon: string;
  title: string;
  points: string[];
}> = ({ icon, title, points }) => (
  <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 hover:border-blue-300 transition-colors">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-zinc-900 mb-4">{title}</h3>
    <ul className="space-y-2">
      {points.map((point, idx) => (
        <li key={idx} className="flex gap-2 text-gray-300">
          <span className="text-blue-400">•</span>
          {point}
        </li>
      ))}
    </ul>
  </div>
);

// METRIC CARD COMPONENT
const MetricCard: React.FC<{ metric: string; label: string }> = ({
  metric,
  label,
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const numericValue = parseInt(metric.replace(/\D/g, ""));
    let current = 0;
    const interval = setInterval(() => {
      if (current < numericValue) {
        current += Math.ceil(numericValue / 20);
        setDisplayValue(Math.min(current, numericValue));
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [metric]);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center hover:border-green-500/50 transition-colors hover:shadow-[0_0_20px_rgba(76,175,80,0.2)]">
      <div className="text-4xl font-bold text-green-400 mb-2">
        {displayValue}%
      </div>
      <p className="text-gray-400">{label}</p>
    </div>
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

export default VisionPlusShowcase;
