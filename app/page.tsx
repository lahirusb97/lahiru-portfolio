"use client";

import Image from "next/image";
import { useState } from "react";
import { FiLinkedin, FiGithub } from "react-icons/fi";
import FeatureDialog from "./components/FeatureDialog";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Home() {
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
        { name: "Django", color: "emerald" },
        { name: "React", color: "cyan" },
        { name: "MySQL", color: "blue" },
        { name: "Hostinger KVM", color: "indigo" },
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
        { name: "Electron.js", color: "blue" },
        { name: "Node.js", color: "emerald" },
        { name: "MySQL/PostgreSQL", color: "yellow" },
        { name: "Hostinger KVM", color: "orange" },
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
        { name: "PostgreSQL", color: "blue" },
        { name: "Digital Ocean", color: "teal" },
      ],
      isFullShowcase: true,
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 text-zinc-900">
      <div className="bg-orbs" aria-hidden="true">
        <span className="bg-orb orb-1" />
        <span className="bg-orb orb-2" />
        <span className="bg-orb orb-3" />
        <span className="bg-orb orb-4" />
      </div>
      <div className="bg-dim" aria-hidden="true" />

      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-8 py-4 backdrop-blur-md md:px-24">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
          Lahiru<span className="text-orange-500">.</span>
        </span>
        <div className="flex items-center gap-8 text-sm font-medium tracking-[0.15em] text-zinc-500">
          <button
            onClick={() => scrollTo("home")}
            className="uppercase transition-colors hover:text-zinc-900"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="uppercase transition-colors hover:text-zinc-900"
          >
            About Me
          </button>
          <button
            onClick={() => scrollTo("projects")}
            className="uppercase transition-colors hover:text-zinc-900"
          >
            Projects
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="rounded-lg border border-orange-400 px-4 py-1.5 text-orange-500 transition-all hover:bg-orange-50 hover:text-orange-600"
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden px-8 pt-20 md:flex-row md:px-24"
      >
        {/* Dot grid background */}
        <div className="hero-dot-grid" aria-hidden="true" />
        {/* Soft glow behind text */}
        <div className="hero-text-glow" aria-hidden="true" />

        {/* Left: Text content */}
        <div className="relative z-10 flex flex-col items-center gap-6 md:flex-1 md:items-start">
          <p className="hero-item-1 text-xs uppercase tracking-[0.35em] text-zinc-500 sm:text-sm">
            Hi, I am Lahiru Shiran
          </p>

          <div className="hero-item-2 hero-heading-wrap text-center md:text-left">
            <h1 className="animate-text-gradient text-3xl font-bold leading-tight md:text-5xl">
              Software Engineer
            </h1>
          </div>

          <p className="hero-item-3 max-w-xl text-center text-base leading-7 text-zinc-600 md:text-left sm:text-lg">
            Helping businesses build scalable, high-performance web applications
            that automate operations, improve efficiency, and support long-term
            growth.
          </p>

          {/* Tech badges */}
          <div className="hero-item-4 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-600 md:justify-start">
            {["Node.js", "Next.js", ".NET ASP", "Django", "Golang"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 shadow-sm transition-all hover:border-zinc-400 hover:shadow-md"
                >
                  {tech}
                </span>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hero-item-5 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <button
              onClick={() => scrollTo("projects")}
              className="animate-scale-pulse cursor-pointer rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg transition-all hover:animate-none hover:from-yellow-400 hover:to-orange-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            >
              My Best Works
            </button>
            <button
              onClick={() => setShowContact(true)}
              className="cursor-pointer rounded-lg border-2 border-zinc-400 px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-700 shadow-sm transition-all hover:border-zinc-700 hover:text-zinc-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
            >
              Contact Me
            </button>
          </div>

          {/* Social Icons */}
          <div className="hero-item-6 flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/lahirushiran/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={24} />
            </a>
            <a
              href="https://github.com/lahirusb97"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
              aria-label="GitHub"
            >
              <FiGithub size={24} />
            </a>
          </div>
        </div>

        {/* Right: Profile image */}
        <div className="hero-item-2 relative z-10 flex flex-1 items-center justify-center">
          <Image
            src="/lahiru.jpg"
            alt="Lahiru Shiran"
            width={320}
            height={320}
            priority
            className="h-56 w-56 rounded-full border-4 border-white bg-zinc-100 object-cover shadow-xl sm:h-72 sm:w-72 md:h-80 md:w-80"
          />
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="relative z-10 px-8 py-24 md:px-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 sm:text-sm">
              About Me
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
              Who I Am
            </h2>
          </div>

          <div className="flex flex-col items-center gap-12 md:flex-row md:items-start">
            {/* Left: intro text */}
            <div className="flex flex-col gap-6 md:flex-1">
              <p className="text-lg leading-8 text-zinc-700">
                I&apos;m{" "}
                <span className="font-semibold text-zinc-900">
                  Lahiru Shiran
                </span>
                , a software engineer passionate about building products that
                solve real-world problems. I specialize in full-stack web
                development with a focus on performance, scalability, and clean
                architecture.
              </p>
              <p className="text-base leading-8 text-zinc-600">
                Over the years I have delivered enterprise-grade systems for
                healthcare, retail, and operations — from multi-branch ERP
                platforms to SaaS applications used daily by businesses. I enjoy
                working across the entire stack, from designing database schemas
                to crafting polished user interfaces.
              </p>
              <p className="text-base leading-8 text-zinc-600">
                When I&apos;m not building software, I&apos;m exploring new
                technologies, contributing to open-source projects, and helping
                teams adopt better engineering practices.
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollTo("projects")}
                  className="cursor-pointer rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all hover:from-yellow-400 hover:to-orange-400 hover:shadow-lg"
                >
                  View Projects
                </button>
                <button
                  onClick={() => setShowContact(true)}
                  className="cursor-pointer rounded-lg border border-zinc-400 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-zinc-700 transition-all hover:border-zinc-700 hover:text-zinc-900"
                >
                  Get In Touch
                </button>
              </div>
            </div>

            {/* Right: skills grid */}
            <div className="w-full md:max-w-sm">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-400">
                Tech Stack
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Node.js", desc: "Backend / APIs" },
                  { name: "Next.js", desc: "Full-stack React" },
                  { name: "Django", desc: "Python web framework" },
                  { name: ".NET ASP", desc: "Enterprise backend" },
                  { name: "React", desc: "UI development" },
                  { name: "Golang", desc: "High-performance services" },
                  { name: "PostgreSQL", desc: "Relational database" },
                  { name: "MySQL", desc: "Relational database" },
                ].map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md"
                  >
                    <p className="text-sm font-medium text-zinc-900">
                      {skill.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 px-8 py-24 md:px-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 sm:text-sm">
              Projects
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl md:text-6xl">
              Featured projects.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            {/* Vision Plus ERP System - BEST WORK */}
            <div className="relative">
              <div className="absolute -top-4 right-4 z-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                ⭐ Best Work
              </div>
              <button
                onClick={() => setSelectedProject(0)}
                className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-yellow-400/60 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:border-yellow-400 hover:shadow-[0_8px_30px_rgba(251,191,36,0.35)]"
              >
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50">
                  <Image
                    src="/visionplus/visionplusfront.jpeg"
                    alt="Vision Plus Storefront"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 text-left">
                  <h3 className="text-xl font-semibold text-zinc-900">
                    Vision Plus Eye Clinic Chain - Enterprise ERP System
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    Advanced multi-branch eye care management with factory order
                    tracking, inventory optimization, and financial reporting.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {["Django", "React", "MySQL", "Hostinger KVM"].map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </div>

            {/* POS SaaS App */}
            <button
              onClick={() => setSelectedProject(1)}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(96,165,250,0.25)]"
            >
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                <Image
                  src="/pos/poshome.png"
                  alt="POS SaaS App"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 text-left">
                <h3 className="text-xl font-semibold text-zinc-900">
                  POS SaaS App
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  A modern point-of-sale system designed for retail businesses
                  with real-time inventory management and reporting capabilities.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {[
                    "Electron.js",
                    "Node.js",
                    "MySQL/PostgreSQL",
                    "Hostinger KVM",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>

            {/* Eye Care Practice Management SaaS */}
            <button
              onClick={() => setSelectedProject(2)}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:border-teal-300 hover:shadow-[0_8px_30px_rgba(45,212,191,0.25)]"
            >
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50">
                <Image
                  src="/eyecare/prescriptionform.png"
                  alt="Eye Care Prescription Form"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 text-left">
                <h3 className="text-xl font-semibold text-zinc-900">
                  Eye Care Practice Management SaaS
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Complete practice management system for eye clinics including
                  patient prescription records, appointment scheduling, and
                  billing.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {[".NET ASP", "React", "PostgreSQL", "Digital Ocean"].map(
                    (t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600"
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <FeatureDialog
        projectMedia={projectMedia}
        selectedProject={selectedProject}
        mediaIndex={mediaIndex}
        setSelectedProject={setSelectedProject}
        setMediaIndex={setMediaIndex}
      />

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative mx-6 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-2xl">
            <button
              onClick={() => setShowContact(false)}
              className="absolute right-4 top-4 text-zinc-400 transition-colors hover:text-zinc-900"
            >
              ✕
            </button>
            <h3 className="text-2xl font-semibold text-zinc-900">
              Get In Touch
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Let&apos;s connect and discuss how I can help your project.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="mailto:lahirushiranit@gmail.com"
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-yellow-300 hover:bg-yellow-50"
              >
                <div className="text-xl">📧</div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    Email
                  </p>
                  <p className="text-zinc-900">lahirushiranit@gmail.com</p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/lahirushiran/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="text-xl">💼</div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    LinkedIn
                  </p>
                  <p className="text-zinc-900">linkedin.com/in/lahirushiran</p>
                </div>
              </a>
            </div>

            <button
              onClick={() => setShowContact(false)}
              className="mt-8 w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
