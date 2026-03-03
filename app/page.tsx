"use client";

import Image from "next/image";
import { useState } from "react";
import { FiLinkedin, FiGithub } from "react-icons/fi";
import FeatureDialog from "./components/FeatureDialog";
import ContactModal from "./components/ContactModal";
import FooterContactForm from "./components/FooterContactForm";
import { Meteors } from "@/components/ui/meteors";

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
      <nav className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-md md:px-24">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
          Lahiru<span className="text-orange-500">.</span>
        </span>
        <div className="flex items-center gap-4">
          {/* Nav links — hidden on mobile, visible sm+ */}
          <div className="hidden items-center gap-6 text-sm font-medium tracking-[0.15em] text-zinc-500 sm:flex md:gap-8">
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
          </div>
          <button
            onClick={() => setShowContact(true)}
            className="rounded-lg border border-orange-400 px-4 py-1.5 text-sm font-medium text-orange-500 transition-all hover:bg-orange-50 hover:text-orange-600"
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden px-6 pt-20 md:flex-row md:gap-0 md:px-0"
      >
        {/* Meteors background */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <Meteors number={20} minDuration={6} maxDuration={14} angle={215} />
        </div>

        {/* Soft glow behind text */}
        <div className="hero-text-glow" aria-hidden="true" />

        {/* Left: Text content */}
        <div className="relative z-10 flex flex-col items-center gap-4 md:flex-1 md:items-center md:gap-6 md:px-10 lg:px-16 xl:px-20">
          <p className="hero-item-1 flex items-center gap-2 text-lg font-bold uppercase tracking-[0.3em] text-zinc-700">
            <span className="h-px w-6 bg-orange-400" />
            Hi, I am Lahiru Shiran
            <span className="h-px w-6 bg-orange-400" />
          </p>

          <div className="hero-item-2 hero-heading-wrap text-center">
            <h1 className="animate-text-gradient text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Software Engineer
            </h1>
          </div>

          <p className="hero-item-3 max-w-xl text-center text-sm leading-7 text-zinc-600 md:text-base md:leading-8">
            Helping businesses build scalable, high-performance web applications
            that automate operations, improve efficiency, and support long-term
            growth.
          </p>

          {/* Tech badges */}
          <div className="hero-item-4 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-600 md:gap-3 md:text-sm">
            {["Node.js", "Next.js", ".NET ASP", "Django", "Golang"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 shadow-sm transition-all hover:border-zinc-400 hover:shadow-md"
                >
                  {tech}
                </span>
              ),
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hero-item-5 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => scrollTo("projects")}
              className="animate-scale-pulse w-full cursor-pointer rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg transition-all hover:animate-none hover:from-yellow-400 hover:to-orange-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 sm:w-auto"
            >
              My Best Works
            </button>
            <button
              onClick={() => setShowContact(true)}
              className="w-full cursor-pointer rounded-lg border-2 border-zinc-400 px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-700 shadow-sm transition-all hover:border-zinc-700 hover:text-zinc-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-400/50 sm:w-auto"
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
              <FiLinkedin size={22} />
            </a>
            <a
              href="https://github.com/lahirusb97"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
              aria-label="GitHub"
            >
              <FiGithub size={22} />
            </a>
          </div>
        </div>

        {/* Right: Profile image — appears first on mobile via order */}
        <div className="hero-item-2 relative z-10 order-first flex flex-1 items-center justify-center md:order-last md:px-10 lg:px-16 xl:px-20">
          {/* Gradient glow blob */}
          <div className="absolute h-[260px] w-[260px] rounded-full bg-gradient-to-br from-blue-200/50 via-violet-200/40 to-orange-100/30 blur-3xl sm:h-[360px] sm:w-[360px] md:h-[500px] md:w-[500px]" />

          {/* Concentric decorative rings */}
          <div className="absolute h-[240px] w-[240px] rounded-full border border-indigo-300/30 sm:h-[320px] sm:w-[320px] md:h-[460px] md:w-[460px]" />
          <div className="absolute h-[200px] w-[200px] rounded-full border border-violet-300/25 sm:h-[270px] sm:w-[270px] md:h-[390px] md:w-[390px]" />
          <div className="absolute h-[164px] w-[164px] rounded-full border border-blue-300/30 sm:h-[220px] sm:w-[220px] md:h-[320px] md:w-[320px]" />

          {/* Floating accent dots */}
          <div className="absolute top-3 right-6 h-2 w-2 rounded-full bg-indigo-400/50 md:top-10 md:right-16 md:h-2.5 md:w-2.5" />
          <div className="absolute bottom-6 left-6 h-1.5 w-1.5 rounded-full bg-orange-400/50 md:bottom-14 md:left-14 md:h-2 md:w-2" />
          <div className="absolute top-10 left-3 h-1.5 w-1.5 rounded-full bg-violet-400/60 md:top-20 md:left-8" />
          <div className="absolute bottom-3 right-5 h-1.5 w-1.5 rounded-full bg-blue-400/50 md:bottom-10 md:right-12" />

          {/* Profile image */}
          <Image
            src="/lahiru-shiran.png"
            alt="Lahiru Shiran"
            width={400}
            height={400}
            priority
            className="relative h-44 w-44 rounded-full border-4 border-white bg-zinc-100 object-cover shadow-2xl sm:h-64 sm:w-64 md:h-[360px] md:w-[360px]"
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
                  with real-time inventory management and reporting
                  capabilities.
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
                    ),
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
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      {/* Footer */}
      <footer className="relative z-10">
        {/* Upper band — ripple + visitor message */}
        <div className="relative overflow-hidden border-t border-zinc-100 bg-gradient-to-b from-white to-zinc-50 px-6 py-24 text-center">
          {/* Ripple rings */}
          <div className="relative mx-auto mb-10 h-16 w-16">
            <div className="footer-ripple-ring" />
            <div className="footer-ripple-ring" />
            <div className="footer-ripple-ring" />
            <div className="footer-ripple-ring" />
            {/* Center icon */}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg text-2xl">
              👋
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
              Thanks for visiting
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-zinc-900 sm:text-4xl">
              Let&apos;s build something{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                great together.
              </span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-500">
              Whether you have a project in mind, a problem to solve, or just want
              to say hi — my inbox is always open.
            </p>

            <FooterContactForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-200 bg-white/80 px-6 py-8 md:px-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 md:flex-row md:items-center md:justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
              Lahiru<span className="text-orange-500">.</span>
            </span>

            <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">
              <button
                onClick={() => scrollTo("home")}
                className="transition-colors hover:text-zinc-900"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="transition-colors hover:text-zinc-900"
              >
                About
              </button>
              <button
                onClick={() => scrollTo("projects")}
                className="transition-colors hover:text-zinc-900"
              >
                Projects
              </button>
              <button
                onClick={() => setShowContact(true)}
                className="transition-colors hover:text-zinc-900"
              >
                Contact
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 md:items-end">
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/lahirushiran/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  <FiLinkedin size={18} />
                </a>
                <a
                  href="https://github.com/lahirusb97"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  <FiGithub size={18} />
                </a>
              </div>
              <p className="text-xs text-zinc-400">
                © {new Date().getFullYear()} Lahiru Shiran. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
