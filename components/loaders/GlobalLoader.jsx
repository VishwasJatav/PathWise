"use client";

import React from "react";
import { m } from "framer-motion";

export default function GlobalLoader({ isTransitionOnly = false }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/5">
      <div className="flex flex-col items-center justify-center gap-y-">
        {/* Animated Electric Core */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Back Glow */}
          <m.div
            className="absolute size- rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 blur-2xl opacity-40"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Glowing Outer Spinning Ring */}
          <m.div
            className="size- rounded-full border border-t-2 border-r-2 border-l-2 border-transparent border-t-blue-500 border-r-indigo-500/80"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner Pulsing Circle */}
          <m.div
            className="absolute size- rounded-full bg-black/40 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            animate={{
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="size- rounded-full bg-blue-500" />
          </m.div>
        </div>

        {/* Brand Text Logo */}
        {!isTransitionOnly && (
          <div className="text-center gap-y-">
            <m.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-extrabold italic tracking-widest text-slate-100"
            >
              PATH<span className="text-sky-500">WISE</span>
            </m.h1>
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4 }}
              className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-400"
            >
              Architecting Careers
            </m.p>
          </div>
        )}
      </div>
    </div>
  );
}
