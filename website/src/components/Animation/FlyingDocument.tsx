"use client";

import { motion } from "framer-motion";
import { examplePassages } from "@/data/performanceData";

interface FlyingDocumentProps {
  isVisible: boolean;
  progress: number;
  currentHop: number;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
}

export default function FlyingDocument({
  isVisible,
  progress,
  currentHop,
  startPosition,
  endPosition,
}: FlyingDocumentProps) {
  if (!isVisible) return null;

  const passage = examplePassages[currentHop];
  if (!passage) return null;

  // Calculate arc trajectory
  // Start from cloud (top-right area), end at context badges (bottom-left)
  const controlPoint = {
    x: (startPosition.x + endPosition.x) / 2 + 50,
    y: Math.min(startPosition.y, endPosition.y) - 50,
  };

  // Quadratic bezier interpolation
  const t = progress;
  const x =
    Math.pow(1 - t, 2) * startPosition.x +
    2 * (1 - t) * t * controlPoint.x +
    Math.pow(t, 2) * endPosition.x;
  const y =
    Math.pow(1 - t, 2) * startPosition.y +
    2 * (1 - t) * t * controlPoint.y +
    Math.pow(t, 2) * endPosition.y;

  const scale = 0.5 + progress * 0.5;
  const rotation = (1 - progress) * 15;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        zIndex: 50,
      }}
      className="pointer-events-none"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-700 p-3 w-40">
        {/* Document icon */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600 dark:text-green-400"
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
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
            {passage.title}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {passage.snippet}
        </p>
      </div>

      {/* Trail effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-400/50 to-transparent rounded-lg blur-md -z-10"
        style={{
          transform: `translateX(-${progress * 20}px)`,
          opacity: 1 - progress,
        }}
      />
    </motion.div>
  );
}
