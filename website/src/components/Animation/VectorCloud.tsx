"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { AnimationPhase } from "@/hooks/useAnimationPhase";

interface Point {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

interface VectorCloudProps {
  phase: AnimationPhase;
  currentHop: number;
  progress: number;
  onDocumentStart?: (x: number, y: number) => void;
  entryFromTop?: boolean;
  entryXPosition?: number; // 0-1, where vector enters from top (default 0.5 = center)
}

const NUM_POINTS = 400;
const POINT_COLOR = "99, 102, 241"; // Indigo
const HEAT_COLOR = "251, 146, 60"; // Orange
const ACTIVE_COLOR = "34, 197, 94"; // Green

// Target positions for each hop (normalized 0-1)
const HOP_TARGETS = [
  { x: 0.3, y: 0.45 },
  { x: 0.65, y: 0.55 },
  { x: 0.4, y: 0.7 },
  { x: 0.7, y: 0.35 },
];

export default function VectorCloud({
  phase,
  currentHop,
  progress,
  onDocumentStart,
  entryFromTop = false,
  entryXPosition = 0.5,
}: VectorCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const [dimensions, setDimensions] = useState({ width: 500, height: 280 });
  const animationRef = useRef<number | null>(null);
  const [vectorPosition, setVectorPosition] = useState<{ x: number; y: number } | null>(null);
  const initializedRef = useRef(false);

  // Get current target position
  const target = HOP_TARGETS[currentHop % HOP_TARGETS.length];
  const targetX = target.x * dimensions.width;
  const targetY = target.y * dimensions.height;

  // Initialize points ONCE
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || initializedRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 400);
    const height = Math.max(rect.height, 220);
    setDimensions({ width, height });

    // Dense cloud distribution
    const points: Point[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.55) * 0.46;
      const x = 0.5 + Math.cos(angle) * r;
      const y = 0.5 + Math.sin(angle) * r;

      points.push({
        x: Math.max(0.06, Math.min(0.94, x)) * width,
        y: Math.max(0.1, Math.min(0.9, y)) * height,
        radius: 1.0 + Math.random() * 2.0,
        opacity: 0.18 + Math.random() * 0.35,
      });
    }
    pointsRef.current = points;
    initializedRef.current = true;
  }, []);

  // Handle phase changes - vector position
  useEffect(() => {
    const tX = target.x * dimensions.width;
    const tY = target.y * dimensions.height;

    if (phase === "vector-traveling") {
      if (entryFromTop) {
        // Vector travels from top at entryXPosition to target
        const startX = dimensions.width * entryXPosition;
        const startY = -20;
        const easedProgress = 1 - Math.pow(1 - progress, 2.5);
        setVectorPosition({
          x: startX + (tX - startX) * easedProgress,
          y: startY + (tY - startY) * easedProgress,
        });
      } else {
        // Original: Vector travels from left to target
        const startX = -25;
        const startY = dimensions.height * 0.5;
        const easedProgress = 1 - Math.pow(1 - progress, 2.5);
        setVectorPosition({
          x: startX + (tX - startX) * easedProgress,
          y: startY + (tY - startY) * easedProgress,
        });
      }
    } else if (phase === "cloud-searching") {
      setVectorPosition({ x: tX, y: tY });
    } else if (phase === "document-returning") {
      if (progress < 0.1) {
        onDocumentStart?.(tX, tY);
      }
      setVectorPosition(null);
    } else {
      setVectorPosition(null);
    }
  }, [phase, currentHop, progress, dimensions, target, onDocumentStart, entryFromTop, entryXPosition]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tX = target.x * dimensions.width;
    const tY = target.y * dimensions.height;

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Subtle background gradient
      const bgGradient = ctx.createRadialGradient(
        dimensions.width / 2, dimensions.height / 2, 0,
        dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.5
      );
      bgGradient.addColorStop(0, "rgba(99, 102, 241, 0.02)");
      bgGradient.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Heat map at target position when searching or returning
      if (phase === "cloud-searching" || phase === "document-returning") {
        const heatGradient = ctx.createRadialGradient(
          tX, tY, 0,
          tX, tY, 80
        );
        const intensity = phase === "cloud-searching"
          ? Math.min(progress * 1.8, 1)
          : Math.max(0, 1 - progress * 0.8);
        heatGradient.addColorStop(0, `rgba(${HEAT_COLOR}, ${0.5 * intensity})`);
        heatGradient.addColorStop(0.4, `rgba(${HEAT_COLOR}, ${0.25 * intensity})`);
        heatGradient.addColorStop(1, `rgba(${HEAT_COLOR}, 0)`);
        ctx.fillStyle = heatGradient;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Ripple ring
        if (phase === "cloud-searching") {
          const rippleRadius = progress * 90;
          ctx.beginPath();
          ctx.arc(tX, tY, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${POINT_COLOR}, ${Math.max(0, 0.4 - rippleRadius / 150)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw all points
      pointsRef.current.forEach((point) => {
        const dist = Math.sqrt(
          Math.pow(point.x - tX, 2) + Math.pow(point.y - tY, 2)
        );
        const isNearTarget = dist < 65;

        let opacity = point.opacity;

        // Highlight nearby points when searching
        if ((phase === "cloud-searching" || phase === "document-returning") && isNearTarget) {
          opacity = Math.min(1, opacity + 0.3 * (1 - dist / 65));
        }

        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${POINT_COLOR}, ${opacity})`;
        ctx.fill();
      });

      // GREEN TARGET POINT at heat map center
      if (phase === "cloud-searching" && progress > 0.4) {
        const greenOpacity = (progress - 0.4) / 0.6;
        const greenRadius = 6 + greenOpacity * 4;

        // Glow
        ctx.beginPath();
        ctx.arc(tX, tY, greenRadius * 3, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(
          tX, tY, 0,
          tX, tY, greenRadius * 3
        );
        glowGradient.addColorStop(0, `rgba(${ACTIVE_COLOR}, ${0.7 * greenOpacity})`);
        glowGradient.addColorStop(1, `rgba(${ACTIVE_COLOR}, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(tX, tY, greenRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACTIVE_COLOR}, ${greenOpacity})`;
        ctx.fill();

        // Inner white
        ctx.beginPath();
        ctx.arc(tX, tY, greenRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${greenOpacity * 0.8})`;
        ctx.fill();
      }

      // Draw traveling vector (comet)
      if (vectorPosition && phase === "vector-traveling") {
        const entryX = dimensions.width * entryXPosition;
        if (entryFromTop) {
          // Trail from top at entryXPosition
          ctx.beginPath();
          ctx.moveTo(entryX, -10);
          ctx.quadraticCurveTo(
            entryX, vectorPosition.y * 0.4,
            vectorPosition.x, vectorPosition.y
          );
          ctx.strokeStyle = `rgba(${POINT_COLOR}, 0.4)`;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          // Trail from left
          ctx.beginPath();
          ctx.moveTo(-15, dimensions.height * 0.5);
          ctx.quadraticCurveTo(
            vectorPosition.x * 0.3, dimensions.height * 0.4,
            vectorPosition.x, vectorPosition.y
          );
          ctx.strokeStyle = `rgba(${POINT_COLOR}, 0.4)`;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Glow
        const glowGradient = ctx.createRadialGradient(
          vectorPosition.x, vectorPosition.y, 0,
          vectorPosition.x, vectorPosition.y, 20
        );
        glowGradient.addColorStop(0, `rgba(${POINT_COLOR}, 0.95)`);
        glowGradient.addColorStop(0.5, `rgba(${POINT_COLOR}, 0.35)`);
        glowGradient.addColorStop(1, `rgba(${POINT_COLOR}, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(vectorPosition.x, vectorPosition.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(vectorPosition.x, vectorPosition.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(vectorPosition.x, vectorPosition.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${POINT_COLOR})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, phase, currentHop, progress, vectorPosition, target, entryFromTop, entryXPosition]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full rounded-xl overflow-hidden border border-gray-100 bg-white"
    >

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </motion.div>
  );
}
