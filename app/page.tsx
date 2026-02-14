"use client";

import Image from "next/image";
import { useState } from "react";
import { FiLinkedin, FiGithub } from "react-icons/fi";
import FeatureDialog from "./components/FeatureDialog";

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const projectMedia = [
    {
      name: "Vision Plus ERP System",
      images: ["/vision-1.jpg", "/vision-2.jpg"],
      video: "/vision-demo.mp4",
      description:
        "Multi-Branch Eye Care Practice Management Platform cutting order processing 60%, reducing inventory errors by 95%, and providing 100% order visibility with advanced features for factory tracking, patient management, and financial reporting.",
      techs: [
        { name: "Node.js", color: "emerald" },
        { name: "React", color: "cyan" },
        { name: "MongoDB", color: "green" },
      ],
      isFullShowcase: true,
      isBestWork: true,
    },
    {
      name: "POS SaaS App",
      images: ["/pos-1.jpg", "/pos-2.jpg", "/pos-3.jpg"],
      video: "/pos-demo.mp4",
      description:
        "A modern point-of-sale system designed for retail businesses with real-time inventory management, comprehensive reporting capabilities, and seamless payment processing. This platform helps business owners streamline their operations and gain valuable insights into their sales.",
      techs: [
        { name: "Express.js", color: "blue" },
        { name: "Node.js", color: "emerald" },
        { name: "React", color: "cyan" },
      ],
      isFullShowcase: true,
    },
    {
      name: "Eye Care Practice Management SaaS",
      images: ["/eyecare/prescriptionform.png"],
      video: "/eyecare-saas-demo.mp4",
      description:
        "A comprehensive practice management system built specifically for eye clinics. Features include patient records management, appointment scheduling, billing and invoicing, prescription management, and compliance with healthcare regulations for streamlined clinic operations.",
      techs: [
        { name: ".NET ASP", color: "purple" },
        { name: "React", color: "cyan" },
      ],
      isFullShowcase: true,
    },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0b1020] text-zinc-100">
      <div className="bg-orbs" aria-hidden="true">
        <span className="bg-orb orb-1" />
        <span className="bg-orb orb-2" />
        <span className="bg-orb orb-3" />
        <span className="bg-orb orb-4" />
      </div>
      <div className="bg-dim" aria-hidden="true" />

      <nav className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-10 text-sm font-medium tracking-[0.2em] text-zinc-300 sm:text-base">
        <button
          className={`cursor-pointer transition-all ${
            slideIndex === 0
              ? "border-b-2 border-white text-white"
              : "border-b-2 border-transparent text-zinc-400 hover:text-zinc-100"
          }`}
          type="button"
          onClick={() => setSlideIndex(0)}
        >
          About Me
        </button>
        <button
          className={`cursor-pointer transition-all ${
            slideIndex === 1
              ? "border-b-2 border-white text-white"
              : "border-b-2 border-transparent text-zinc-400 hover:text-zinc-100"
          }`}
          type="button"
          onClick={() => setSlideIndex(1)}
        >
          My Works
        </button>
      </nav>

      <main
        className="relative z-10 flex h-full w-[200vw] transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${slideIndex * 100}vw)` }}
      >
        <section
          id="about"
          className="flex h-full w-screen items-center justify-center px-6"
        >
          <div className="max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400 sm:text-sm">
              About Me
            </p>
            <div className="mt-6 flex flex-col items-center">
              <Image
                src="/lahiru.jpg"
                alt="Lahiru Shiran"
                width={240}
                height={240}
                priority
                className="h-36 w-36 rounded-full border border-white/20 bg-white/5 object-cover shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:h-40 sm:w-40"
              />
              <p className="mt-3 text-sm font-medium tracking-[0.2em] text-zinc-200">
                Lahiru Shiran
              </p>
            </div>
            <h1 className="mt-6 text-xl font-semibold leading-tight text-white sm:text-xl md:text-3xl">
              Software Engineer & Founder — running two live SaaS platforms and
              a medical Eye Clinic enterprise ERP system
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Helping businesses build scalable, high-performance web
              applications that automate operations, improve efficiency, and
              support long-term growth.
            </p>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-300">
              Currently working as{" "}
              <span className="font-semibold text-white">
                Software Engineer
              </span>{" "}
              at{" "}
              <span className="font-semibold text-white">$x4DigitalLabs</span>,
              Sri Lanka, specializing in{" "}
              <span className="text-cyan-400">Node.js</span>,{" "}
              <span className="text-cyan-400">Next.js</span>,{" "}
              <span className="text-cyan-400">Nest.js</span>, and{" "}
              <span className="text-cyan-400">Golang</span> development.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-zinc-400">
              <span className="rounded-full border border-white/10 px-3 py-1 transition-all hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Node.js
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 transition-all hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Next.js
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 transition-all hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                .NET ASP
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 transition-all hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Django
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 transition-all hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Golang
              </span>
            </div>
            <button
              onClick={() => setSlideIndex(1)}
              className="mt-10 cursor-pointer rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-gray-900 shadow-lg transition-all hover:from-yellow-400 hover:to-orange-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 animate-scale-pulse hover:animate-none"
            >
              My Best Works
            </button>
            <button
              onClick={() => setShowContact(true)}
              className="ml-4 mt-4 cursor-pointer rounded-lg border-2 border-zinc-400 px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-300 shadow-lg transition-all hover:border-white hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
            >
              Contact Me
            </button>
          </div>
        </section>

        <section
          id="works"
          className="flex h-full w-screen flex-col items-center justify-center overflow-y-auto px-6 py-16"
        >
          <div className="w-full max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-400 sm:text-sm">
                My Works
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Featured projects.
              </h2>
              <button
                onClick={() => setShowContact(true)}
                className="mt-8 cursor-pointer rounded-lg border-2 border-zinc-400 px-6 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300 transition-all hover:border-white hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
              >
                Get In Touch
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
              {/* Vision Plus ERP System - BEST WORK */}
              <div className="relative">
                {/* Best Work Badge */}
                <div className="absolute -top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ">
                  ⭐ Best Work
                </div>
                <button
                  onClick={() => setSelectedProject(0)}
                  className="group cursor-pointer transform overflow-hidden rounded-lg border-2 border-yellow-400/60 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 backdrop-blur transition-all duration-300 hover:border-yellow-300/80 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:scale-105 flex h-full flex-col w-full"
                >
                  <div className="relative h-48 w-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/visionplus/visionplusfront.jpeg"
                      alt="Vision Plus Storefront"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 text-left">
                    <h3 className="text-xl font-semibold text-white">
                      Vision Plus Eye Clinic Chain - Enterprise ERP System
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Advanced multi-branch eye care management with factory
                      order tracking, inventory optimization, and financial
                      reporting.
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        Node.js
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        React
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        Django
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              {/* POS SaaS App */}
              <button
                onClick={() => setSelectedProject(1)}
                className="group cursor-pointer transform overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(96,165,250,0.4)] hover:scale-105 flex h-full flex-col"
              >
                <div className="relative h-48 w-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/pos/poshome.png"
                    alt="POS SaaS App"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 text-left">
                  <h3 className="text-xl font-semibold text-white">
                    POS SaaS App
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    A modern point-of-sale system designed for retail businesses
                    with real-time inventory management and reporting
                    capabilities.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      Express.js
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      Node.js
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      React
                    </span>
                  </div>
                </div>
              </button>

              {/* Eye Care Practice Management SaaS */}
              <button
                onClick={() => setSelectedProject(2)}
                className="group cursor-pointer transform overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-teal-400/60 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:scale-105 flex h-full flex-col"
              >
                <div className="relative h-48 w-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/eyecare/prescriptionform.png"
                    alt="Eye Care Prescription Form"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 text-left">
                  <h3 className="text-xl font-semibold text-white">
                    Eye Care Practice Management SaaS
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Complete practice management system for eye clinics
                    including patient Prescription records, appointment
                    scheduling, and billing.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      .NET ASP
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      React
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>
      </main>

      <FeatureDialog
        projectMedia={projectMedia}
        selectedProject={selectedProject}
        mediaIndex={mediaIndex}
        setSelectedProject={setSelectedProject}
        setMediaIndex={setMediaIndex}
      />

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
          <div className="relative mx-6 w-full max-w-md rounded-lg border border-white/20 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 p-8 shadow-2xl">
            <button
              onClick={() => setShowContact(false)}
              className="absolute right-4 top-4 text-zinc-400 transition-colors hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-semibold text-white">Get In Touch</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Let's connect and discuss how I can help your project.
            </p>

            <div className="mt-8 space-y-4">
              {/* Email */}
              <a
                href="mailto:lahirushiranit@gmail.com"
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-yellow-400/60 hover:bg-yellow-500/10"
              >
                <div className="text-xl">📧</div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    Email
                  </p>
                  <p className="text-white">lahirushiranit@gmail.com</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/lahirushiran/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-blue-400/60 hover:bg-blue-500/10"
              >
                <div className="text-xl">💼</div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    LinkedIn
                  </p>
                  <p className="text-white">linkedin.com/in/lahirushiran</p>
                </div>
              </a>
            </div>

            <button
              onClick={() => setShowContact(false)}
              className="mt-8 w-full rounded-lg bg-gradient-to-r from-zinc-700 to-zinc-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-zinc-600 hover:to-zinc-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-6">
        <a
          href="https://www.linkedin.com/in/lahirushiran/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-lg p-2"
          aria-label="LinkedIn"
        >
          <FiLinkedin size={24} />
        </a>
        <a
          href="https://github.com/lahirusb97"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-lg p-2"
          aria-label="GitHub"
        >
          <FiGithub size={24} />
        </a>
      </footer>
    </div>
  );
}
