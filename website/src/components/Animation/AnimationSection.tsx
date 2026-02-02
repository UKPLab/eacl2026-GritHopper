"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import VectorCloud from "./VectorCloud";
import GritHopperBlock from "./GritHopperBlock";
import ContextBadges from "./ContextBadges";
import PerformanceGraph from "../Graph/PerformanceGraph";
import TrainingVisualization from "../Training/TrainingVisualization";
import { useAnimationPhase } from "@/hooks/useAnimationPhase";

// Target positions for each hop (normalized 0-1) - must match VectorCloud
const HOP_TARGETS = [
  { x: 0.3, y: 0.45 },
  { x: 0.65, y: 0.55 },
  { x: 0.4, y: 0.7 },
  { x: 0.7, y: 0.35 },
];

export default function AnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-5% 0px -5% 0px" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [cloudDimensions, setCloudDimensions] = useState({ width: 500, height: 220 });

  const { currentHop, phase, progress, isComplete, reset } = useAnimationPhase(
    isPlaying,
    4
  );

  // Get cloud dimensions for accurate document position
  useEffect(() => {
    if (cloudRef.current) {
      const rect = cloudRef.current.getBoundingClientRect();
      setCloudDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    if (isInView && !isPlaying && !isComplete) {
      const timer = setTimeout(() => setIsPlaying(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, isPlaying, isComplete]);

  // Documents to show: max 3 (D1, D2, D3). D4 is found but not appended.
  const visibleDocs = Math.min(currentHop + (phase === "context-updating" && currentHop < 3 ? 1 : 0), 3);
  const visibleHops = currentHop + (phase === "context-updating" || isComplete ? 1 : 0);

  const handleReplay = () => {
    reset();
    setTimeout(() => setIsPlaying(true), 150);
  };

  const showInputToModel = phase === "processing";
  const showVectorOutput = phase === "vector-traveling" || phase === "cloud-searching";
  const showDocumentReturn = phase === "document-returning" && currentHop < 3;
  const showContextUpdate = phase === "context-updating" && currentHop < 3;

  // Get current target position in the cloud (where green point appears)
  const currentTarget = HOP_TARGETS[currentHop % 4];
  const docStartX = currentTarget.x * cloudDimensions.width;
  const docStartY = currentTarget.y * cloudDimensions.height;

  // Tensor visualization values
  const tensorValues = [
    [0.8, 0.3, 0.9, 0.2, 0.7, 0.5, 0.4, 0.6, 0.85, 0.35, 0.65, 0.45],
    [0.6, 0.7, 0.4, 0.8, 0.3, 0.9, 0.5, 0.2, 0.75, 0.55, 0.25, 0.95],
    [0.4, 0.5, 0.7, 0.6, 0.8, 0.3, 0.9, 0.4, 0.65, 0.85, 0.45, 0.35],
    [0.9, 0.4, 0.5, 0.7, 0.2, 0.8, 0.6, 0.3, 0.55, 0.75, 0.95, 0.25],
  ];
  const currentTensor = tensorValues[currentHop % 4];

  return (
    <section
      ref={containerRef}
      className="py-6 px-4 md:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="text-gray-700 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            <span className="font-semibold text-blue-600">GRITHopper</span> is a state-of-the-art multi-hop dense retriever
            and the first <span className="font-semibold">decoder-based model</span> to perform multi-hop retrieval in an
            encoder-only fashion, similar to{" "}
            <a href="https://arxiv.org/abs/2009.12756" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              MDR <span className="text-gray-500">(Xiong et al., 2021)</span>
            </a>{" "}
            and{" "}
            <a href="https://aclanthology.org/2024.naacl-long.404/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              BeamRetriever <span className="text-gray-500">(Zhang et al., 2024)</span>
            </a>.
            Unlike previous approaches that struggle with longer reasoning chains and out-of-distribution data,
            GRITHopper achieves robust performance by combining dense retrieval with generative training objectives.
          </p>
        </motion.div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            How Decomposition-Free Retrieval Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs md:text-sm">
            Watch GRITHopper recursively retrieve documents by expanding context with each hop.
          </p>
        </motion.div>

        {/* Animation + Graph side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* LEFT: Animation Stage */}
          <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-4 md:p-5">

            {/* Row 1: Expanding Context + Arrow + GritHopper */}
            <div className="grid grid-cols-[150px_auto_1fr] gap-4 items-start mb-4">

              {/* Stage 1: Input / Expanding Context */}
              <div className="relative" ref={contextRef}>
                <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">1</div>
                  <span>
                    {currentHop === 0 && !showContextUpdate ? (
                      "Input"
                    ) : showContextUpdate ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-600 font-semibold"
                      >
                        Expanding Context
                      </motion.span>
                    ) : (
                      "Expanding Context"
                    )}
                  </span>
                </div>
                <ContextBadges currentHop={visibleDocs} isComplete={isComplete} maxDocs={3} />

                {/* Document landing zone indicator */}
                <AnimatePresence>
                  {showDocumentReturn && progress > 0.8 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-1 bg-green-400 rounded-full"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Arrow with compression animation */}
              <div className="flex flex-col items-center justify-center pt-10">
                <div className="relative h-8">
                  <AnimatePresence>
                    {showInputToModel && (
                      <>
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={`flow-${i}`}
                            initial={{ opacity: 0, x: -15, scale: 1 }}
                            animate={{
                              opacity: [0, 1, 1, 0],
                              x: [-15, 0, 20, 40],
                              scale: [1, 0.7, 0.4, 0.2],
                            }}
                            transition={{
                              duration: 0.7,
                              delay: i * 0.15,
                              repeat: Infinity,
                              repeatDelay: 0.2,
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-400 rounded-sm"
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                  <motion.div
                    animate={{ opacity: showInputToModel ? 1 : 0.4 }}
                    className="text-blue-400"
                  >
                    <svg className="w-12 h-6" viewBox="0 0 48 24" fill="none" stroke="currentColor">
                      <path d="M 4 12 L 38 12 M 38 12 L 30 6 M 38 12 L 30 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>
                <span className="text-[10px] text-gray-400 mt-1">encode</span>
              </div>

              {/* Stage 2: Encoding */}
              <div className="relative">
                <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">2</div>
                  Encoding
                </div>
                <GritHopperBlock phase={phase} progress={progress} />

                {/* Tensor/Vector visualization with label - FIXED HEIGHT to prevent layout shift */}
                <div className="mt-3 flex flex-col items-center h-[70px]">
                  <div className="flex flex-col items-center min-h-[45px]">
                    <AnimatePresence>
                      {(showVectorOutput || phase === "processing") && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: phase === "processing" ? progress * 0.7 : 1,
                          }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center"
                        >
                          <div className="flex gap-0.5 mb-1">
                            {currentTensor.map((val, i) => (
                              <motion.div
                                key={i}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="w-2 rounded-sm"
                                style={{
                                  height: `${12 + val * 16}px`,
                                  backgroundColor: `hsl(${220 + val * 60}, 75%, ${45 + val * 20}%)`,
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-[9px] text-gray-400">Dense Vector (dim 4096)</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Arrow down to embedding space - no bounce animation */}
                  <motion.div
                    animate={{
                      opacity: showVectorOutput ? 1 : 0.3,
                    }}
                    className="text-indigo-400"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Row 2: Search Embedding Space (FULL WIDTH) */}
            <div className="relative">
              <div className="text-xs text-gray-500 font-medium flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</div>
                  Search Documents in Embedding Space
                </div>
                {/* Document Vector legend */}
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
                  <span>Document Vector</span>
                </div>
              </div>
              <div ref={cloudRef} className="h-[220px] relative">
                <VectorCloud
                  phase={phase}
                  currentHop={currentHop}
                  progress={progress}
                  onDocumentStart={() => {}}
                  entryFromTop={true}
                  entryXPosition={0.65} // Align with center of tensor output
                />

                {/* Document found indicator */}
                <AnimatePresence>
                  {(phase === "cloud-searching" && progress > 0.6) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-lg z-20"
                    >
                      D{currentHop + 1} found!
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Document return animation - starts FROM green point, goes TO context box */}
                <AnimatePresence>
                  {showDocumentReturn && (
                    <motion.div
                      className="absolute z-20 pointer-events-none"
                      style={{
                        left: docStartX - 14, // Center the icon
                        top: docStartY - 14,
                      }}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{
                        opacity: progress < 0.95 ? 1 : 0,
                        scale: progress < 0.95 ? 1 : 0.5,
                        x: progress * (-docStartX - 30), // Go all the way to left edge
                        y: progress * (-docStartY - 250), // Go up above the cloud to context
                      }}
                      transition={{
                        duration: 0.05,
                        ease: "linear"
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [-8, 8, -8] }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                        className="bg-green-500 rounded-lg p-2 shadow-lg shadow-green-500/40"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Return path label */}
                {currentHop < 3 && (
                  <div className="absolute top-3 left-3 text-[10px] text-gray-400 flex items-center gap-1">
                    <motion.div animate={{ opacity: showDocumentReturn ? 1 : 0.3 }}>
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </motion.div>
                    <span className={showDocumentReturn ? "text-green-600 font-medium" : ""}>
                      {showDocumentReturn ? "returning to context" : "document returns"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hop progress */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {[1, 2, 3, 4].map((hop) => (
                <motion.div
                  key={hop}
                  animate={{
                    backgroundColor: currentHop >= hop - 1
                      ? (currentHop === hop - 1 && !isComplete ? "#3b82f6" : "#22c55e")
                      : "#e5e7eb",
                    scale: currentHop === hop - 1 && !isComplete ? 1.1 : 1,
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ color: currentHop >= hop - 1 ? "#fff" : "#9ca3af" }}
                >
                  {hop}
                </motion.div>
              ))}
              <span className="ml-2 text-xs text-gray-500 font-medium">
                {isComplete ? "Complete!" : `Hop ${currentHop + 1}/4`}
              </span>
              {isComplete && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleReplay}
                  className="ml-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-xs flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Replay
                </motion.button>
              )}
            </div>
          </div>

          {/* RIGHT: Performance Graph */}
          <div className="min-h-[500px]">
            <PerformanceGraph
              visibleHops={visibleHops}
              isComplete={isComplete}
            />
          </div>
        </div>

        {/* Results Table - Unified Per-Hop Hits@1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Open Retrieval Performance (Hits@1)</h3>

          {/* Single unified table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-semibold text-gray-700" rowSpan={2}>Model</th>
                  <th className="text-center px-1 font-semibold text-gray-700 border-l border-gray-200" colSpan={5}>MuSiQue</th>
                  <th className="text-center px-1 font-semibold text-gray-700 border-l border-gray-200" colSpan={5}>HoVer</th>
                  <th className="text-center px-1 font-semibold text-gray-700 border-l border-gray-200" colSpan={4}>ExFever</th>
                  <th className="text-center px-1 font-semibold text-purple-700 border-l border-gray-200" colSpan={3}>MoreHopQA*</th>
                </tr>
                <tr className="bg-gray-50 text-gray-500 border-b">
                  {/* MuSiQue */}
                  <th className="text-center px-1 py-1 border-l border-gray-200">H1</th>
                  <th className="text-center px-1">H2</th>
                  <th className="text-center px-1">H3</th>
                  <th className="text-center px-1">H4</th>
                  <th className="text-center px-1 font-bold text-gray-700">Avg</th>
                  {/* HoVer */}
                  <th className="text-center px-1 border-l border-gray-200">H1</th>
                  <th className="text-center px-1">H2</th>
                  <th className="text-center px-1">H3</th>
                  <th className="text-center px-1">H4</th>
                  <th className="text-center px-1 font-bold text-gray-700">Avg</th>
                  {/* ExFever */}
                  <th className="text-center px-1 border-l border-gray-200">H1</th>
                  <th className="text-center px-1">H2</th>
                  <th className="text-center px-1">H3</th>
                  <th className="text-center px-1 font-bold text-gray-700">Avg</th>
                  {/* MoreHopQA */}
                  <th className="text-center px-1 border-l border-gray-200">H1</th>
                  <th className="text-center px-1">H2</th>
                  <th className="text-center px-1 font-bold text-gray-700">Avg</th>
                </tr>
              </thead>
              <tbody>
                {/* GRITHopper */}
                <tr className="bg-blue-50 font-medium border-b">
                  <td className="py-1.5 px-2 text-blue-700 font-semibold">GRITHopper (ours)</td>
                  <td className="text-center font-mono border-l border-gray-100">94.25</td>
                  <td className="text-center font-mono">76.13</td>
                  <td className="text-center font-mono">55.45</td>
                  <td className="text-center font-mono">32.10</td>
                  <td className="text-center font-mono font-bold">76.42</td>
                  <td className="text-center font-mono border-l border-gray-100">95.86</td>
                  <td className="text-center font-mono">91.56</td>
                  <td className="text-center font-mono">91.69</td>
                  <td className="text-center font-mono">92.31</td>
                  <td className="text-center font-mono font-bold">93.88</td>
                  <td className="text-center font-mono border-l border-gray-100">96.88</td>
                  <td className="text-center font-mono">92.20</td>
                  <td className="text-center font-mono">85.38</td>
                  <td className="text-center font-mono font-bold">93.02</td>
                  <td className="text-center font-mono border-l border-gray-100">96.96</td>
                  <td className="text-center font-mono">93.92</td>
                  <td className="text-center font-mono font-bold">95.44</td>
                </tr>
                {/* GRITLM */}
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 px-2">GRITLM-7B</td>
                  <td className="text-center font-mono border-l border-gray-100">91.15</td>
                  <td className="text-center font-mono">57.51</td>
                  <td className="text-center font-mono">22.32</td>
                  <td className="text-center font-mono">5.43</td>
                  <td className="text-center font-mono">60.51</td>
                  <td className="text-center font-mono border-l border-gray-100">95.81</td>
                  <td className="text-center font-mono">88.09</td>
                  <td className="text-center font-mono">83.95</td>
                  <td className="text-center font-mono">88.46</td>
                  <td className="text-center font-mono">91.81</td>
                  <td className="text-center font-mono border-l border-gray-100">91.13</td>
                  <td className="text-center font-mono">54.88</td>
                  <td className="text-center font-mono">17.28</td>
                  <td className="text-center font-mono">63.83</td>
                  <td className="text-center font-mono border-l border-gray-100">98.75</td>
                  <td className="text-center font-mono">95.53</td>
                  <td className="text-center font-mono">97.14</td>
                </tr>
                {/* BeamRetriever */}
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 px-2">BeamRetriever</td>
                  <td className="text-center font-mono border-l border-gray-100">88.75</td>
                  <td className="text-center font-mono">60.70</td>
                  <td className="text-center font-mono">30.73</td>
                  <td className="text-center font-mono">12.84</td>
                  <td className="text-center font-mono">62.80</td>
                  <td className="text-center font-mono border-l border-gray-100">98.04</td>
                  <td className="text-center font-mono">88.96</td>
                  <td className="text-center font-mono">85.96</td>
                  <td className="text-center font-mono">76.92</td>
                  <td className="text-center font-mono">93.42</td>
                  <td className="text-center font-mono border-l border-gray-100">-</td>
                  <td className="text-center font-mono">-</td>
                  <td className="text-center font-mono">-</td>
                  <td className="text-center font-mono">-</td>
                  <td className="text-center font-mono border-l border-gray-100">97.85</td>
                  <td className="text-center font-mono">93.02</td>
                  <td className="text-center font-mono">95.44</td>
                </tr>
                {/* MDR */}
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 px-2">MDR</td>
                  <td className="text-center font-mono border-l border-gray-100">81.75</td>
                  <td className="text-center font-mono">45.18</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono">63.47</td>
                  <td className="text-center font-mono border-l border-gray-100">84.77</td>
                  <td className="text-center font-mono">65.69</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono">77.10</td>
                  <td className="text-center font-mono border-l border-gray-100">92.93</td>
                  <td className="text-center font-mono">77.16</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono">85.13</td>
                  <td className="text-center font-mono border-l border-gray-100">88.73</td>
                  <td className="text-center font-mono">75.58</td>
                  <td className="text-center font-mono">82.16</td>
                </tr>
                {/* Separator for decomposition-based */}
                <tr className="bg-gray-100">
                  <td colSpan={18} className="py-1 px-2 text-[9px] text-gray-600 italic">Decomposition-based (LLM + retriever)</td>
                </tr>
                {/* Qwen 32B + GRITLM - evaluated on ALL datasets */}
                <tr className="border-b border-gray-100 bg-amber-50/30">
                  <td className="py-1.5 px-2 text-amber-800">Qwen2.5-32B + GRITLM</td>
                  <td className="text-center font-mono border-l border-gray-100">82.62</td>
                  <td className="text-center font-mono">45.72</td>
                  <td className="text-center font-mono">13.91</td>
                  <td className="text-center font-mono">1.48</td>
                  <td className="text-center font-mono">51.06</td>
                  <td className="text-center font-mono border-l border-gray-100">75.38</td>
                  <td className="text-center font-mono">61.44</td>
                  <td className="text-center font-mono">50.43</td>
                  <td className="text-center font-mono">46.15</td>
                  <td className="text-center font-mono">67.69</td>
                  <td className="text-center font-mono border-l border-gray-100">63.24</td>
                  <td className="text-center font-mono">29.88</td>
                  <td className="text-center font-mono">11.93</td>
                  <td className="text-center font-mono">40.90</td>
                  <td className="text-center font-mono border-l border-gray-100">96.24</td>
                  <td className="text-center font-mono">55.19</td>
                  <td className="text-center font-mono">75.72</td>
                </tr>
                {/* GPT-4o + GRITLM - only evaluated on MuSiQue (MultiHop-RAG is in graph) */}
                <tr className="bg-green-50/30">
                  <td className="py-1.5 px-2 text-green-800">GPT-4o + GRITLM</td>
                  <td className="text-center font-mono border-l border-gray-100">81.96</td>
                  <td className="text-center font-mono">48.53</td>
                  <td className="text-center font-mono">13.39</td>
                  <td className="text-center font-mono">1.98</td>
                  <td className="text-center font-mono">51.81</td>
                  <td className="text-center font-mono border-l border-gray-100 text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono border-l border-gray-100 text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono border-l border-gray-100 text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                  <td className="text-center font-mono text-gray-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            *MoreHopQA is a zero-shot (out-of-distribution) benchmark. H1-H4 = Hop depth. MultiHop-RAG results shown in graph above.
          </p>
        </motion.div>

        {/* Key Strengths + Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Key Strengths</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Encoder-Only Efficiency */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-10 h-10 mb-3 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Encoder-Only Efficiency</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Each retrieval iteration requires only a single forward pass, rather than multiple autoregressive steps.
              </p>
            </div>

            {/* OOD Robustness */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <div className="w-10 h-10 mb-3 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">OOD Robustness</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                State-of-the-art performance compared to other decomposition-free methods on multiple out-of-distribution benchmarks.
              </p>
            </div>

            {/* Unified Training */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="w-10 h-10 mb-3 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Unified Training</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Combines dense retrieval with generative objectives, exploring how post-retrieval generation loss improves dense retrieval.
              </p>
            </div>

            {/* Stopping */}
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="w-10 h-10 mb-3 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Self-Stopping</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Utilizes generative capabilities via ReAct to control its own state, stopping itself through causal next-token prediction.
              </p>
            </div>
          </div>

          {/* Quick Start */}
          <div className="max-w-5xl mx-auto">
            <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Quick Start</h4>
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Terminal - wider */}
              <div className="flex-1 bg-gray-900 rounded-lg p-4 font-mono text-sm shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-500 text-xs ml-2">terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-white">pip install grithopper</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-4 bg-white inline-block"
                  />
                </div>
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/UKPLab/GritHopper"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors shadow-lg"
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">GitHub</div>
                  <div className="text-gray-400 text-xs">Check our code</div>
                </div>
              </a>

              {/* HuggingFace */}
              <a
                href="https://huggingface.co/UKPLab/GritHopper-7B"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 transition-colors shadow-lg"
              >
                <span className="text-3xl">🤗</span>
                <div className="text-left">
                  <div className="text-gray-900 font-semibold text-sm">HuggingFace</div>
                  <div className="text-gray-700 text-xs">GritHopper-7B</div>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Training GRITHopper Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Training GRITHopper</h3>
          <TrainingVisualization />
        </motion.div>

        {/* BibTeX Citation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 mb-8"
          id="citation"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Citation</h3>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                <span className="text-gray-400 text-sm font-mono">BibTeX</span>
                <button
                  onClick={() => {
                    const bibtex = `@inproceedings{erker2026grithopper,
  title={{GRITHopper}: Decomposition-Free Multi-Hop Dense Retrieval},
  author={Erker, Justus-Jonas and Reimers, Nils and Gurevych, Iryna},
  booktitle={Proceedings of the 2026 Conference of the European Chapter of the Association for Computational Linguistics (EACL)},
  year={2026},
  url={https://arxiv.org/abs/2503.07519}
}`;
                    navigator.clipboard.writeText(bibtex);
                    const btn = document.getElementById('copy-bibtex-btn');
                    if (btn) {
                      btn.textContent = 'Copied!';
                      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
                    }
                  }}
                  id="copy-bibtex-btn"
                  className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto">
{`@inproceedings{erker2026grithopper,
  title={{GRITHopper}: Decomposition-Free Multi-Hop Dense Retrieval},
  author={Erker, Justus-Jonas and Reimers, Nils and Gurevych, Iryna},
  booktitle={Proceedings of the 2026 Conference of the European Chapter
             of the Association for Computational Linguistics (EACL)},
  year={2026},
  url={https://arxiv.org/abs/2503.07519}
}`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
