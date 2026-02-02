"use client";

import { useState, useEffect, useCallback } from "react";

export type AnimationPhase =
  | "idle"
  | "processing"
  | "vector-traveling"
  | "cloud-searching"
  | "document-returning"
  | "context-updating";

export interface AnimationState {
  currentHop: number;
  phase: AnimationPhase;
  progress: number; // 0-1 within current phase
}

// Slower, more deliberate timing (~3.5s per hop = ~14s total)
const PHASE_DURATIONS: Record<AnimationPhase, number> = {
  idle: 300,
  processing: 700,
  "vector-traveling": 800,
  "cloud-searching": 900,
  "document-returning": 700,
  "context-updating": 400,
};

const PHASE_ORDER: AnimationPhase[] = [
  "idle",
  "processing",
  "vector-traveling",
  "cloud-searching",
  "document-returning",
  "context-updating",
];

export function useAnimationPhase(isPlaying: boolean, totalHops: number = 4) {
  const [state, setState] = useState<AnimationState>({
    currentHop: 0,
    phase: "idle",
    progress: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  const reset = useCallback(() => {
    setState({ currentHop: 0, phase: "idle", progress: 0 });
    setIsComplete(false);
  }, []);

  useEffect(() => {
    if (!isPlaying || isComplete) return;

    let animationFrame: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;

      setState((prev) => {
        const currentPhaseIndex = PHASE_ORDER.indexOf(prev.phase);
        const phaseDuration = PHASE_DURATIONS[prev.phase];
        const phaseProgress = Math.min(elapsed / phaseDuration, 1);

        if (phaseProgress >= 1) {
          // Move to next phase
          const nextPhaseIndex = currentPhaseIndex + 1;

          if (nextPhaseIndex >= PHASE_ORDER.length) {
            // Completed one hop
            const nextHop = prev.currentHop + 1;

            if (nextHop >= totalHops) {
              setIsComplete(true);
              return { ...prev, progress: 1 };
            }

            startTime = timestamp;
            return {
              currentHop: nextHop,
              phase: PHASE_ORDER[0],
              progress: 0,
            };
          }

          startTime = timestamp;
          return {
            ...prev,
            phase: PHASE_ORDER[nextPhaseIndex],
            progress: 0,
          };
        }

        return { ...prev, progress: phaseProgress };
      });

      if (!isComplete) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, isComplete, totalHops]);

  return { ...state, isComplete, reset };
}
