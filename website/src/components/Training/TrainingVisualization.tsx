"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Token component
function Token({ text, color, animate = false, delay = 0 }: {
  text: string;
  color: string;
  animate?: boolean;
  delay?: number;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800",
    indigo: "bg-indigo-100 text-indigo-800",
    green: "bg-green-200 text-green-900",
    red: "bg-red-200 text-red-900",
    gray: "bg-gray-100 text-gray-600",
  };

  if (animate) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.2, type: "spring" }}
        className={`inline-block px-1.5 py-0.5 text-[10px] font-mono rounded ${colorClasses[color] || colorClasses.gray}`}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono rounded ${colorClasses[color] || colorClasses.gray}`}>
      {text}
    </span>
  );
}

// Mini GritHopper block with logo
function MiniGritHopperBlock() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="w-6 h-6 rounded overflow-hidden">
        <Image
          src="/logos/grithopper-logo.jpeg"
          alt="GritHopper"
          width={24}
          height={24}
          className="object-cover"
        />
      </div>
      <span className="text-[10px] font-semibold text-gray-800">GritHopper-7B</span>
    </div>
  );
}

// Contrastive Learning Column - shows Q→D1 then Q+D1→D2 with positives/negatives
function ContrastiveColumn({ isPlaying }: { isPlaying: boolean }) {
  const [hop, setHop] = useState(0); // 0 = hop1 (Q→D1), 1 = hop2 (Q+D1→D2)

  useEffect(() => {
    if (!isPlaying) {
      setHop(0);
      return;
    }
    const interval = setInterval(() => {
      setHop(h => (h + 1) % 2); // Loop between hop 1 and hop 2
    }, 2400); // Slower cycle (50% slower)
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-blue-50/50 rounded-lg border border-blue-200 p-3 h-full flex flex-col">
      <div className="text-xs font-bold text-blue-800 mb-1">Contrastive</div>
      <div className="text-[10px] text-blue-600 mb-2">Embedding similarity loss</div>

      {/* Animation showing embedding space */}
      <div className="flex-1 bg-white rounded p-2 border border-blue-100">
        {/* Input context / Anchor */}
        <div className="mb-2">
          <div className="text-[9px] text-gray-500 mb-1">Anchor (query context)</div>
          <div className="flex flex-wrap gap-0.5">
            <Token text="Q" color="blue" />
            {hop >= 1 && <Token text="D1" color="indigo" animate={hop === 1} />}
          </div>
        </div>

        {/* GritHopper block */}
        <div className="flex justify-center my-2">
          <MiniGritHopperBlock />
        </div>

        {/* Embedding space visualization - STATIC positions */}
        <div className="relative h-24 bg-gradient-to-br from-slate-50 to-blue-50 rounded border border-slate-200 overflow-hidden">
          <div className="absolute top-1 left-1 text-[7px] text-slate-400">
            Embedding Space - Hop {hop + 1}
          </div>

          {/* Anchor point - static position */}
          <div className="absolute top-1/2 left-[20%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[7px] font-bold shadow-md">
            {hop === 0 ? "Q" : "Q+D1"}
          </div>

          {/* Positive document - static position, pulled close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={`pos-${hop}`}
            className="absolute top-[35%] left-[42%] w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[6px] font-bold shadow"
          >
            {hop === 0 ? "D1" : "D2"}
          </motion.div>

          {/* Negative document - static position, pushed away */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={`neg-${hop}`}
            className="absolute top-[60%] right-[12%] w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-white text-[5px] font-bold shadow"
          >
            {hop === 0 ? "D1_N" : "D2_N"}
          </motion.div>

          {/* Pull arrow (dashed, animated) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.line
              x1="26%" y1="50%" x2="38%" y2="40%"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              animate={isPlaying ? { strokeDashoffset: [0, -10] } : {}}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <text x="30%" y="38%" fill="#22c55e" fontSize="7" fontWeight="bold">pull</text>
          </svg>

          {/* Push arrow (dashed, animated) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.line
              x1="50%" y1="50%" x2="75%" y2="60%"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              animate={isPlaying ? { strokeDashoffset: [0, 10] } : {}}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <text x="58%" y="52%" fill="#ef4444" fontSize="7" fontWeight="bold">push</text>
          </svg>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-2 p-2 bg-blue-100/50 rounded text-[9px] text-blue-800 leading-relaxed">
        <strong>Hop {hop + 1}:</strong> Anchor {hop === 0 ? "Q" : "Q+D1"} pulls {hop === 0 ? "D1" : "D2"} (positive) closer,
        pushes {hop === 0 ? "D1_N" : "D2_N"} (hard negative from distractors) away.
      </div>
    </div>
  );
}

// Causal LM Column with next token prediction animation
function CausalLMColumn({
  variant,
  title,
  subtitle,
  inputTokens,
  outputTokens,
  explanation,
  isPlaying
}: {
  variant: "noPost" | "answer" | "reward";
  title: string;
  subtitle: string;
  inputTokens: { text: string; color: string }[];
  outputTokens: { text: string; color: string }[];
  explanation: string;
  isPlaying: boolean;
}) {
  const [visibleOutputs, setVisibleOutputs] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setVisibleOutputs(0);
      return;
    }
    const interval = setInterval(() => {
      setVisibleOutputs(v => {
        // Loop continuously - reset after all tokens shown
        if (v >= outputTokens.length) return 0;
        return v + 1;
      });
    }, 375); // 50% slower (was 250ms)
    return () => clearInterval(interval);
  }, [isPlaying, outputTokens.length]);

  useEffect(() => {
    if (!isPlaying) {
      const timer = setTimeout(() => setVisibleOutputs(0), 300);
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  const borderColor = {
    noPost: "border-gray-200",
    answer: "border-green-200",
    reward: "border-purple-200",
  }[variant];

  const bgColor = {
    noPost: "bg-gray-50/50",
    answer: "bg-green-50/50",
    reward: "bg-purple-50/50",
  }[variant];

  const titleColor = {
    noPost: "text-gray-800",
    answer: "text-green-800",
    reward: "text-purple-800",
  }[variant];

  const explanationBg = {
    noPost: "bg-gray-100/50 text-gray-700",
    answer: "bg-green-100/50 text-green-800",
    reward: "bg-purple-100/50 text-purple-800",
  }[variant];

  return (
    <div className={`${bgColor} rounded-lg border ${borderColor} p-3 h-full flex flex-col`}>
      <div className={`text-xs font-bold ${titleColor} mb-1`}>{title}</div>
      <div className="text-[10px] text-gray-500 mb-2">{subtitle}</div>

      {/* Animation area */}
      <div className="flex-1 bg-white rounded p-2 border border-gray-100">
        {/* Input */}
        <div className="mb-2">
          <div className="text-[9px] text-gray-500 mb-1">Input</div>
          <div className="flex flex-wrap gap-0.5">
            {inputTokens.map((t, i) => (
              <Token key={i} text={t.text} color={t.color} />
            ))}
          </div>
        </div>

        {/* GritHopper block */}
        <div className="flex justify-center my-2">
          <MiniGritHopperBlock />
        </div>

        {/* Output with animation */}
        <div>
          <div className="text-[9px] text-gray-500 mb-1">Output (next token prediction)</div>
          <div className="flex flex-wrap gap-0.5 min-h-[36px]">
            {outputTokens.slice(0, visibleOutputs).map((t, i) => (
              <Token key={i} text={t.text} color={t.color} animate delay={0} />
            ))}
            {isPlaying && visibleOutputs < outputTokens.length && (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="inline-block w-1.5 h-4 bg-blue-400 rounded-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className={`mt-2 p-2 rounded text-[9px] leading-relaxed ${explanationBg}`}>
        {explanation}
      </div>
    </div>
  );
}

// Ablation Results Table
function AblationTable() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
      <div className="text-sm font-bold text-gray-900 mb-3">Ablation Results (Hits@1)</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Distractor Setting */}
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-2">MuSiQue Distractor Setting</div>
          <table className="w-full text-xs">
            <tbody>
              <tr className="bg-purple-50">
                <td className="py-1.5 px-2">Answers + Reward</td>
                <td className="text-right font-mono font-bold text-purple-700">82.32</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-1.5 px-2">Answers Only</td>
                <td className="text-right font-mono font-bold text-green-700">82.08</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2">No Post-Retrieval LM</td>
                <td className="text-right font-mono">80.78</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2">Contrastive Only</td>
                <td className="text-right font-mono">78.02</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Open Retrieval */}
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-2">Open Retrieval (avg. 2 seeds)</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-gray-500 border-b">
                <th className="text-left py-1 px-1">Dataset</th>
                <th className="text-right px-1">Ans+Rew</th>
                <th className="text-right px-1">Ans</th>
                <th className="text-right px-1">No Post</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1 px-1">MuSiQue</td><td className="text-right font-mono px-1">76.16</td><td className="text-right font-mono px-1">75.95</td><td className="text-right font-mono px-1">75.22</td></tr>
              <tr><td className="py-1 px-1">ExFever</td><td className="text-right font-mono px-1">87.10</td><td className="text-right font-mono font-bold px-1">91.81</td><td className="text-right font-mono px-1">89.69</td></tr>
              <tr><td className="py-1 px-1">HoVer</td><td className="text-right font-mono px-1">93.34</td><td className="text-right font-mono font-bold px-1">94.29</td><td className="text-right font-mono px-1">94.36</td></tr>
              <tr className="border-t"><td className="py-1 px-1 text-purple-700">MultiHop-RAG</td><td className="text-right font-mono px-1">51.74</td><td className="text-right font-mono font-bold px-1">54.03</td><td className="text-right font-mono px-1">51.13</td></tr>
              <tr><td className="py-1 px-1 text-purple-700">MoreHopQA</td><td className="text-right font-mono font-bold px-1">96.14</td><td className="text-right font-mono px-1">95.80</td><td className="text-right font-mono px-1">94.68</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Key Findings
function KeyFindings() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-4 mt-4">
      <div className="text-sm font-bold text-gray-900 mb-2">Key Findings</div>
      <div className="text-xs text-gray-700 space-y-2">
        <p>
          <span className="font-semibold text-green-700">Answer prediction always helps:</span>{" "}
          Adding the final answer to the generative loss teaches the model what information is needed to solve the query,
          improving retrieval quality (+4.06 Hits@1 on MuSiQue).
        </p>
        <p>
          <span className="font-semibold text-amber-700">Reward modeling trade-off:</span>{" "}
          While observing causal negatives improves discrimination on handcrafted distractors (82.32 Hits@1),
          it overfits to these specific negatives. In open retrieval, reward modeling causes a{" "}
          <span className="font-bold">7.32% drop</span> vs only <span className="font-bold">5.09%</span> for answers-only,
          indicating that learning to reject specific negatives hurts generalization to unseen corpora.
        </p>
      </div>
    </div>
  );
}

export default function TrainingVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-25% 0px -25% 0px" });
  const [isPlaying, setIsPlaying] = useState(false);

  // Start animation when in view, reset when out of view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsPlaying(true), 400);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [isInView]);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Intro explaining training objectives */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <p className="text-sm text-gray-700 mb-3">
          GRITHopper uses a joint training objective combining <span className="font-semibold text-blue-600">contrastive learning</span> for
          embedding similarity and <span className="font-semibold text-green-600">causal language modeling</span> for next-token prediction:
        </p>
        <div className="text-center mb-3">
          <span className="text-base font-mono font-bold text-gray-800 bg-white px-3 py-1 rounded border">
            L = L<sub>rep</sub> + L<sub>gen</sub>
          </span>
        </div>
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Post-retrieval language modeling</span> refers to predicting tokens that appear <em>after</em> the
          retrieval chain (e.g., the final answer). By keeping the retrieval sequence identical for both losses and only appending
          post-retrieval tokens to the generative objective, we ensure any performance gains come from learning what information
          is useful, not from extra computation or thinking tokens.
        </p>
      </div>

      {/* 4 Columns side by side */}
      <div className="grid grid-cols-4 gap-3">
        {/* Contrastive */}
        <ContrastiveColumn isPlaying={isPlaying} />

        {/* No Post-Retrieval LM */}
        <CausalLMColumn
          variant="noPost"
          title="No Post-Retrieval LM"
          subtitle="Same sequence for both losses"
          inputTokens={[
            { text: "Q", color: "blue" },
            { text: "D1", color: "indigo" },
            { text: "D2", color: "indigo" },
          ]}
          outputTokens={[
            { text: "Q", color: "blue" },
            { text: "D1", color: "indigo" },
            { text: "D2", color: "indigo" },
            { text: "Eval:", color: "gray" },
            { text: "Relevant", color: "green" },
          ]}
          explanation="We add 'Eval: Relevant' to match sequence length with other variants. Since it's always the same token, it provides no discriminative signal—isolating whether gains come from actual post-retrieval info vs. just more compute tokens."
          isPlaying={isPlaying}
        />

        {/* + Answer */}
        <CausalLMColumn
          variant="answer"
          title="+ Answer"
          subtitle="Post-retrieval answer tokens"
          inputTokens={[
            { text: "Q", color: "blue" },
            { text: "D1", color: "indigo" },
            { text: "D2", color: "indigo" },
          ]}
          outputTokens={[
            { text: "Q", color: "blue" },
            { text: "D1", color: "indigo" },
            { text: "D2", color: "indigo" },
            { text: "Eval:", color: "gray" },
            { text: "Relevant", color: "green" },
            { text: "Ans:", color: "gray" },
            { text: "Cairo", color: "green" },
          ]}
          explanation="The final answer is appended as post-retrieval signal. This teaches what information leads to correct answers, improving retrieval."
          isPlaying={isPlaying}
        />

        {/* + Reward Modeling */}
        <CausalLMColumn
          variant="reward"
          title="+ Reward"
          subtitle="Causal negative observation"
          inputTokens={[
            { text: "Q", color: "blue" },
            { text: "D1", color: "indigo" },
            { text: "Distractor", color: "red" },
          ]}
          outputTokens={[
            { text: "Q", color: "blue" },
            { text: "D1", color: "indigo" },
            { text: "Denver...", color: "red" },
            { text: "Eval:", color: "gray" },
            { text: "Irrelevant", color: "red" },
          ]}
          explanation="Hard negatives are observed causally with 'Irrelevant' label. Improves distractor discrimination but can overfit."
          isPlaying={isPlaying}
        />
      </div>

      {/* Replay button */}
      <div className="text-center">
        <button
          onClick={() => {
            setIsPlaying(false);
            setTimeout(() => setIsPlaying(true), 100);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Replay Animation
        </button>
      </div>

      {/* Ablation Table */}
      <AblationTable />

      {/* Key Findings */}
      <KeyFindings />
    </div>
  );
}
