"use client";

import React from "react";
import VisionPlusShowcase from "./VisionPlusShowcase";
import POSSaaSShowcase from "./POSSaaSShowcase";
import EyeCareSaaSShowcase from "./EyeCareSaaSShowcase";

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
  if (selectedProject === null) {
    return null;
  }

  // Check if this is a full showcase project
  const isFullShowcase =
    selectedProject >= 0 &&
    selectedProject < projectMedia.length &&
    projectMedia[selectedProject]?.isFullShowcase;
  const isVisionPlusShowcase = selectedProject === 0 && isFullShowcase;
  const isPOSSaaSShowcase = selectedProject === 1 && isFullShowcase;
  const isEyeCareSaaSShowcase = selectedProject === 2 && isFullShowcase;

  return (
    <div
      className="fixed inset-0 z-50 flex h-full w-full items-stretch justify-center bg-black/80 backdrop-blur-sm"
      onClick={() => {
        setSelectedProject(null);
        setMediaIndex(0);
      }}
    >
      <div
        className="relative h-full w-full bg-[#0b1020] shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedProject(null);
            setMediaIndex(0);
          }}
          className="sticky top-4 left-4 z-10 text-white hover:text-zinc-400 transition-colors float-right mr-4"
          aria-label="Close"
        >
          <svg
            className="h-6 w-6"
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

        {/* Render appropriate showcase based on project */}
        {isVisionPlusShowcase ? (
          <VisionPlusShowcase />
        ) : isPOSSaaSShowcase ? (
          <POSSaaSShowcase />
        ) : isEyeCareSaaSShowcase ? (
          <EyeCareSaaSShowcase />
        ) : (
          <div className="p-8">
            {/* Traditional project showcase content */}
            <div className="mb-8">
              <div className="relative mb-4 h-96 w-full overflow-hidden rounded-lg bg-gradient-to-br from-white/5 to-white/10">
                <div className="relative w-full h-full flex items-center justify-center bg-white/5 animate-pulse">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-zinc-400">Image/Video Placeholder</p>
                  </div>
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
                  className="flex items-center justify-center h-10 w-10 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-400">
                    {mediaIndex + 1} /{" "}
                    {projectMedia[selectedProject].images.length + 1}
                  </span>
                  <div className="flex gap-2">
                    {projectMedia[selectedProject].images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMediaIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          mediaIndex === idx
                            ? "w-6 bg-white"
                            : "w-2 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                    <button
                      onClick={() =>
                        setMediaIndex(
                          projectMedia[selectedProject].images.length,
                        )
                      }
                      className={`h-2 rounded-full transition-all ${
                        mediaIndex ===
                        projectMedia[selectedProject].images.length
                          ? "w-6 bg-white"
                          : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                      title="Video"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const media = projectMedia[selectedProject];
                    const totalMedia = media.images.length + 1;
                    setMediaIndex((mediaIndex + 1) % totalMedia);
                  }}
                  className="flex items-center justify-center h-10 w-10 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {selectedProject === 0 && (
              <>
                <h2 className="text-3xl font-bold text-white">
                  {projectMedia[0].name}
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-300">
                  {projectMedia[0].description}
                </p>
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
                    Tech Stack
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {projectMedia[0].techs.map((tech) => (
                      <span
                        key={tech.name}
                        className={`rounded-full border border-${tech.color}-500/50 bg-${tech.color}-500/10 px-4 py-2 text-sm text-${tech.color}-300`}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedProject === 1 && (
              <>
                <h2 className="text-3xl font-bold text-white">
                  {projectMedia[1].name}
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-300">
                  {projectMedia[1].description}
                </p>
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
                    Tech Stack
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {projectMedia[1].techs.map((tech) => (
                      <span
                        key={tech.name}
                        className={`rounded-full border border-${tech.color}-500/50 bg-${tech.color}-500/10 px-4 py-2 text-sm text-${tech.color}-300`}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedProject === 2 && (
              <>
                <h2 className="text-3xl font-bold text-white">
                  {projectMedia[2].name}
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-300">
                  {projectMedia[2].description}
                </p>
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
                    Tech Stack
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {projectMedia[2].techs.map((tech) => (
                      <span
                        key={tech.name}
                        className={`rounded-full border border-${tech.color}-500/50 bg-${tech.color}-500/10 px-4 py-2 text-sm text-${tech.color}-300`}
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
  );
}
