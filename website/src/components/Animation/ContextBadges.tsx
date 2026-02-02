"use client";

import { motion, AnimatePresence } from "framer-motion";
import { exampleQuery, examplePassages } from "@/data/performanceData";

interface ContextBadgesProps {
  currentHop: number;
  isComplete: boolean;
  maxDocs?: number; // Max documents to show (default 3 for 4-hop)
}

export default function ContextBadges({ currentHop, isComplete, maxDocs = 3 }: ContextBadgesProps) {
  // Show documents: D1, D2, D3 max (D4 is found but not appended)
  const numDocs = Math.min(currentHop, maxDocs);
  const visiblePassages = examplePassages.slice(0, numDocs);

  return (
    <div className="flex flex-col gap-1.5 p-2 bg-white rounded-lg border border-gray-200">
      {/* Query badge - always visible */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative"
      >
        <div className="px-2.5 py-1.5 bg-blue-500 text-white text-xs font-medium rounded flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Query
        </div>
        {/* Tooltip */}
        <div className="absolute left-full ml-2 top-0 w-52 p-2.5 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 text-[11px] text-gray-600 leading-relaxed">
          {exampleQuery}
        </div>
      </motion.div>

      {/* Document badges - D1, D2, D3 (max 3) */}
      <AnimatePresence mode="popLayout">
        {visiblePassages.map((passage, idx) => (
          <motion.div
            key={passage.id}
            initial={{ opacity: 0, scale: 0.5, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative"
          >
            <div className="px-2.5 py-1.5 bg-green-500 text-white text-xs font-medium rounded flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              D{idx + 1}
            </div>
            {/* Tooltip */}
            <div className="absolute left-full ml-2 top-0 w-44 p-2.5 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
              <p className="text-[11px] font-semibold text-gray-800 mb-1">{passage.title}</p>
              <p className="text-[10px] text-gray-600 leading-relaxed">{passage.snippet}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
