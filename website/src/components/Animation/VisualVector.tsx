"use client";

import { motion } from "framer-motion";
import type { AnimationPhase } from "@/hooks/useAnimationPhase";

interface VisualVectorProps {
  phase: AnimationPhase;
  progress: number;
  currentHop: number;
}

// Generate pseudo-random but consistent values for each hop
const getVectorValues = (hop: number): number[] => {
  const seed = hop * 17 + 3;
  return Array.from({ length: 12 }, (_, i) => {
    const val = Math.sin(seed + i * 0.7) * 0.5 + 0.5;
    return Math.max(0, Math.min(1, val));
  });
};

// Color interpolation from blue (0) to purple (0.5) to orange (1)
const getValueColor = (value: number): string => {
  if (value < 0.5) {
    // Blue to purple
    const t = value * 2;
    const r = Math.round(59 + t * (139 - 59));
    const g = Math.round(130 + t * (92 - 130));
    const b = Math.round(246 + t * (246 - 246));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Purple to orange
    const t = (value - 0.5) * 2;
    const r = Math.round(139 + t * (249 - 139));
    const g = Math.round(92 + t * (115 - 92));
    const b = Math.round(246 + t * (22 - 246));
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export default function VisualVector({ phase, progress, currentHop }: VisualVectorProps) {
  const isVisible = phase === "processing" || phase === "vector-traveling" || phase === "cloud-searching";
  const values = getVectorValues(currentHop);

  // Animation: cells appear one by one during processing
  const visibleCells = phase === "processing"
    ? Math.floor(progress * values.length)
    : values.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isVisible ? 1 : 0.3,
        scale: isVisible ? 1 : 0.95,
      }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Label */}
      <div className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        Dense Vector
      </div>

      {/* Vector visualization - horizontal bar of colored cells */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex gap-0.5">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: idx < visibleCells ? 1 : 0.1,
                scaleY: idx < visibleCells ? 1 : 0.3,
              }}
              transition={{
                duration: 0.15,
                delay: phase === "processing" ? idx * 0.03 : 0,
              }}
              className="w-4 h-8 rounded-sm origin-bottom"
              style={{
                backgroundColor: idx < visibleCells ? getValueColor(value) : "#e5e7eb",
              }}
            />
          ))}
        </div>

        {/* Dimension label */}
        <div className="mt-1.5 text-[10px] text-gray-400 text-center">
          d = 4096
        </div>
      </div>

      {/* Arrow pointing right (to cloud) */}
      {(phase === "vector-traveling" || phase === "cloud-searching") && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -right-8 top-1/2 -translate-y-1/2"
        >
          <motion.svg
            className="w-6 h-6 text-indigo-500"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </motion.svg>
        </motion.div>
      )}
    </motion.div>
  );
}
