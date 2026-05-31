"use client";

import React, { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const DEFAULT_MESSAGES = [
  "Analyzing career credentials...",
  "Generating ATS-optimized phrasing...",
  "Building career path architecture...",
  "Synthesizing market insights...",
  "Polishing structural formatting...",
];

export default function AILoader({ message }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Rotate messages automatically
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const activeMessage = message || DEFAULT_MESSAGES[messageIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md mx-4 p-8 rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col items-center justify-center gap-y-"
      >
        {/* Animated AI Orb Container */}
        <div className="relative size- flex items-center justify-center">
          {/* Pulsing Backlight */}
          <m.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Morphing Neural Core */}
          <m.div
            className="absolute size- rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            animate={{
              borderRadius: [
                "42% 58% 70% 30% / 45% 45% 55% 55%",
                "70% 30% 52% 48% / 60% 40% 60% 40%",
                "42% 58% 70% 30% / 45% 45% 55% 55%",
              ],
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="size- text-white animate-pulse" />
          </m.div>

          {/* Orbital Particle 1 */}
          <m.div
            className="absolute size- rounded-full bg-cyan-400"
            animate={{
              x: [0, 45, 0, -45, 0],
              y: [-45, 0, 45, 0, -45],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Orbital Particle 2 */}
          <m.div
            className="absolute size- rounded-full bg-pink-400"
            animate={{
              x: [0, -45, 0, 45, 0],
              y: [45, 0, -45, 0, 45],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Text Container with Fading Message */}
        <div className="text-center w-full min-h-[48px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <m.p
              key={activeMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-slate-200 text-sm font-semibold tracking-wide"
            >
              {activeMessage}
            </m.p>
          </AnimatePresence>
        </div>

        {/* Accessibility Status Area */}
        <span className="sr-only" aria-live="assertive">
          {activeMessage}
        </span>
      </m.div>
    </div>
  );
}
