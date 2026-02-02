"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { AnimationPhase } from "@/hooks/useAnimationPhase";

interface GritHopperBlockProps {
  phase: AnimationPhase;
  progress: number;
}

export default function GritHopperBlock({ phase, progress }: GritHopperBlockProps) {
  // Progress bar only active during encoding (processing) phase
  const isActive = phase === "processing";

  const getStatusText = () => {
    switch (phase) {
      case "processing":
        return "Creating dense vector...";
      case "vector-traveling":
        return "Searching index...";
      case "cloud-searching":
        return "Finding nearest neighbor...";
      case "document-returning":
        return "Retrieving document...";
      case "context-updating":
        return "Updating context...";
      default:
        return "Ready";
    }
  };

  return (
    <motion.div
      animate={{
        boxShadow: isActive
          ? "0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)"
          : "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-xl p-4 border border-gray-200 overflow-hidden"
    >
      {/* Animated background gradient when active */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"
          style={{
            backgroundSize: "200% 100%",
            animation: "gradient-shift 2s linear infinite",
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header with logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md">
            <Image
              src="/logos/grithopper-logo.jpeg"
              alt="GritHopper"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              GRITHopper-7B
            </h3>
            <p className="text-xs text-gray-500">
              Multi-Hop Dense Embedder
            </p>
          </div>
        </div>

        {/* Processing bar */}
        <div className="relative h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: isActive ? `${progress * 100}%` : phase === "idle" ? "0%" : "100%",
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
          {/* Shimmer effect */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>

        {/* Status text */}
        <div className="flex items-center justify-between">
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            {getStatusText()}
          </motion.span>

          {/* Neural network icon animation */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-4 bg-blue-400 rounded-full"
                animate={{
                  scaleY: isActive ? [1, 1.5, 1] : 1,
                  opacity: isActive ? [0.5, 1, 0.5] : 0.3,
                }}
                transition={{
                  duration: 0.6,
                  repeat: isActive ? Infinity : 0,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
}
