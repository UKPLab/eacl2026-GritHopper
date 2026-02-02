"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { performanceData, hopLabels } from "@/data/performanceData";

interface PerformanceGraphProps {
  visibleHops: number;
  isComplete: boolean;
}

export default function PerformanceGraph({
  visibleHops,
  isComplete,
}: PerformanceGraphProps) {
  const gritHopperOpacity = useMemo(() => {
    if (visibleHops === 0) return 0.15;
    return Math.min(0.15 + visibleHops * 0.22, 1);
  }, [visibleHops]);

  const chartData = useMemo(() => {
    return hopLabels.map((label, idx) => {
      const dataPoint: Record<string, string | number | null> = { name: label };
      performanceData.forEach((model) => {
        if (model.isMain) {
          dataPoint[model.name] = model.data[idx];
          dataPoint[`${model.name}_visible`] = idx < visibleHops ? model.data[idx] : null;
        } else {
          dataPoint[model.name] = model.data[idx];
        }
      });
      return dataPoint;
    });
  }, [visibleHops]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200 h-full flex flex-col"
    >
      {/* Title */}
      <div className="mb-3">
        <h3 className="text-base md:text-lg font-bold text-gray-900">
          MultiHop-RAG Benchmark
        </h3>
        <p className="text-xs text-gray-500">
          Hits@1 (Tang et al., 2024)
        </p>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#4b5563" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "11px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => value != null ? [`${Number(value).toFixed(1)}%`, ""] : ["", ""]}
            />

            {/* Baseline lines - animation disabled to prevent re-animation on data changes */}
            {performanceData.filter((m) => !m.isMain).map((model) => (
              <Line
                key={model.name}
                type="monotone"
                dataKey={model.name}
                stroke={model.color}
                strokeWidth={2}
                strokeOpacity={0.45}
                dot={{ r: 3, fill: model.color, fillOpacity: 0.45, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                name={model.displayName}
                isAnimationActive={false}
              />
            ))}

            {/* GritHopper dashed preview - animation disabled */}
            {performanceData.filter((m) => m.isMain).map((model) => (
              <Line
                key={`${model.name}-bg`}
                type="monotone"
                dataKey={model.name}
                stroke={model.color}
                strokeWidth={2}
                strokeOpacity={0.12}
                strokeDasharray="4 4"
                dot={{ r: 2, fill: model.color, fillOpacity: 0.12, strokeWidth: 0 }}
                activeDot={false}
                name=""
                legendType="none"
                isAnimationActive={false}
              />
            ))}

            {/* GritHopper visible */}
            {performanceData.filter((m) => m.isMain).map((model) => (
              <Line
                key={`${model.name}-visible`}
                type="monotone"
                dataKey={`${model.name}_visible`}
                stroke={model.color}
                strokeWidth={3}
                strokeOpacity={gritHopperOpacity}
                dot={{ r: 5, fill: model.color, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7, stroke: model.color, strokeWidth: 2 }}
                name={model.displayName}
                connectNulls
                isAnimationActive={true}
                animationDuration={350}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="space-y-1.5">
          {performanceData.map((model) => (
            <div
              key={model.name}
              className={`flex items-start gap-2 ${model.isMain ? "" : "opacity-60"}`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${
                  model.isMain ? "ring-1 ring-offset-1 ring-blue-200" : ""
                }`}
                style={{ backgroundColor: model.color }}
              />
              <span className={`leading-tight ${model.isMain ? "text-xs font-semibold text-gray-800" : "text-[10px] text-gray-600"}`}>
                {model.displayName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        {!isComplete && visibleHops > 0 ? (
          <motion.div className="text-xs text-blue-600 flex items-center gap-1.5 font-medium">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
            Hop {visibleHops} of 4
          </motion.div>
        ) : visibleHops === 0 ? (
          <div className="text-xs text-gray-400">Waiting...</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-green-600 flex items-center gap-1.5 font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Complete
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
