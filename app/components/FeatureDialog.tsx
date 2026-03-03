"use client";

import React, { useState } from "react";
import VisionPlusShowcase from "./VisionPlusShowcase";
import POSSaaSShowcase from "./POSSaaSShowcase";
import EyeCareSaaSShowcase from "./EyeCareSaaSShowcase";
import { exportShowcaseToPDF } from "../utils/pdf-export";

type ProjectTech = {
  name: string;
  color: string;
};

type ProjectMedia = {
  name: string;
  images: string[];
  video: string;
  description: string;
  techs: ProjectTech[];
  isFullShowcase?: boolean;
};

type FeatureDialogProps = {
  projectMedia: ProjectMedia[];
  selectedProject: number | null;
  mediaIndex: number;
  setSelectedProject: (value: number | null) => void;
  setMediaIndex: (value: number) => void;
};

export default function FeatureDialog({
  projectMedia,
  selectedProject,
  mediaIndex,
  setSelectedProject,
  setMediaIndex,
}: FeatureDialogProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handlePDFExport = async () => {
    if (selectedProject === null) return;
    setIsExporting(true);
    try {
      const projectName = projectMedia[selectedProject]?.name || "Showcase";
      await exportShowcaseToPDF(projectName);
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedProject === null) {
    return null;
  }

  const isFullShowcase =
    selectedProject >= 0 &&
    selectedProject < projectMedia.length &&
    projectMedia[selectedProject]?.isFullShowcase;
  const isVisionPlusShowcase = selectedProject === 0 && isFullShowcase;
  const isPOSSaaSShowcase = selectedProject === 1 && isFullShowcase;
  const isEyeCareSaaSShowcase = selectedProject === 2 && isFullShowcase;

  return (
    /* Backdrop — click outside to close */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={() => {
        setSelectedProject(null);
        setMediaIndex(0);
      }}
    >
      {/* Dialog panel */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky action bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-zinc-100 bg-white/95 backdrop-blur px-6 py-3">
          <span className="text-sm font-semibold text-zinc-700 truncate">
            {projectMedia[selectedProject]?.name}
          </span>
          <div className="flex items-center gap-2">
            {/* PDF Export */}
            <button
              onClick={handlePDFExport}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Export as PDF"
            >
              {isExporting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Exporting…</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  <span>Export PDF</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                setSelectedProject(null);
                setMediaIndex(0);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Close"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-50">
          {isVisionPlusShowcase ? (
            <VisionPlusShowcase />
          ) : isPOSSaaSShowcase ? (
            <POSSaaSShowcase />
          ) : isEyeCareSaaSShowcase ? (
            <EyeCareSaaSShowcase />
          ) : (
            <div className="p-8">
              <div className="mb-8">
                <div className="relative mb-4 h-80 w-full overflow-hidden rounded-xl bg-zinc-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🖼️</div>
                    <p className="text-zinc-400 text-sm">Image Placeholder</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      const media = projectMedia[selectedProject];
                      const totalMedia = media.images.length + 1;
                      setMediaIndex(
                        mediaIndex === 0 ? totalMedia - 1 : mediaIndex - 1,
                      );
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-400">
                      {mediaIndex + 1} / {projectMedia[selectedProject].images.length + 1}
                    </span>
                    <div className="flex gap-2">
                      {projectMedia[selectedProject].images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMediaIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            mediaIndex === idx ? "w-6 bg-zinc-700" : "w-2 bg-zinc-300 hover:bg-zinc-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const media = projectMedia[selectedProject];
                      const totalMedia = media.images.length + 1;
                      setMediaIndex((mediaIndex + 1) % totalMedia);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {projectMedia[selectedProject] && (
                <>
                  <h2 className="text-2xl font-bold text-zinc-900">
                    {projectMedia[selectedProject].name}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-zinc-600">
                    {projectMedia[selectedProject].description}
                  </p>
                  <div className="mt-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                      Tech Stack
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {projectMedia[selectedProject].techs.map((tech) => (
                        <span
                          key={tech.name}
                          className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-700 shadow-sm"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
