"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Building2, Terminal, Briefcase, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (isMounted) setStep(1); // Show typed query
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (isMounted) setStep(2); // Show analyzing state
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (isMounted) setStep(3); // Show final answer
    };
    sequence();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden relative">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 gap-y- text-center md:text-left z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Text Content */}
          <div className="gap-y- flex flex-col items-center lg:items-start text-center lg:text-left">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <Sparkles className="mr-2 size-" />
              Rixora AI Career & Study Hub 2.0
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl xl:text-8xl text-foreground"
            >
              Rise Through <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">Knowledge.</span>
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed"
            >
              Rixora is your AI-powered career coaching and study hub — from ATS resume building to mock interviews, cover letters to personalized learning paths. Built for the next generation of professionals.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/dashboard" className="w-full sm:w-auto block relative group">
                {/* Animated Electric Glow layer behind */}
                <m.div
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 opacity-60 blur-xl group-hover:opacity-90 transition duration-500"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Interactive Premium Button */}
                <m.button
                  whileHover="hover"
                  whileTap="tap"
                  initial="initial"
                  variants={{
                    initial: { scale: 1, y: 0 },
                    hover: { scale: 1.02, y: -2 }
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="relative w-full sm:w-auto px-8 h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold tracking-wide text-base text-white bg-black/40 hover:bg-black/60 border border-white/10 hover:border-blue-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Inner Border Shine */}
                  <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none" />
                  
                  {/* Sliding Glass Sheen */}
                  <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started with Rixora — Free
                    <m.span
                      variants={{
                        initial: { x: 0 },
                        hover: { x: 5 }
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ChevronRight className="size- text-indigo-400 group-hover:text-blue-400 transition-colors" />
                    </m.span>
                  </span>
                </m.button>
              </Link>
            </m.div>
          </div>

          {/* Right Perplexity-style Mockup */}
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-xl mx-auto lg:ml-auto perspective-1000"
          >
            <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl p-6 ring-1 ring-white/10 overflow-hidden group">

              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="gap-y-">
                {/* Search Bar Simulation */}
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 shadow-inner">
                  <Search className="size- text-indigo-400" />
                  <div className="flex-1 text-left relative h-6">
                    <AnimatePresence mode="wait">
                      {step === 0 && (
                        <m.span
                          key="typing-indicator"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-muted-foreground text-sm flex items-center h-full"
                        >
                          Ask anything… <span className="w-1.5 h-4 bg-muted-foreground ml-1 animate-pulse" />
                        </m.span>
                      )}
                      {step >= 1 && (
                        <m.span
                          key="typed-query"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-foreground text-sm font-medium flex items-center h-full"
                        >
                          How do I transition from Marketing to Tech inside 6 months?
                        </m.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* AI Response Area */}
                <div className="min-h-[220px]">
                  <AnimatePresence mode="wait">
                    {step === 2 && (
                      <m.div
                        key="analyzing"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 text-sm text-indigo-400 h-[220px]"
                      >
                        <Sparkles className="size- animate-spin-slow" />
                        Synthesizing market trends & skill gaps…
                      </m.div>
                    )}

                    {step >= 3 && (
                      <m.div
                        key="answer"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="gap-y-"
                      >
                        <div className="flex gap-2">
                          <div className="size- rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                            <Sparkles className="size- text-white" />
                          </div>
                          <div className="gap-y-">
                            <p className="text-sm text-gray-200 leading-relaxed font-medium">
                              Based on current 2025 market data, a transition from Marketing to Tech is highly viable if you target <span className="text-indigo-300">Growth Product Management</span> or <span className="text-indigo-300">Developer Relations</span>.
                            </p>

                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                                <Terminal className="size- text-pink-400" />
                                <span className="text-xs text-gray-300">Learn SQL & Python</span>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                                <Building2 className="size- text-purple-400" />
                                <span className="text-xs text-gray-300">Target SaaS Startups</span>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground pt-1 flex items-center">
                              <Briefcase className="size- mr-1" />
                              Estimated salary bump: +24% to 35%
                            </p>
                          </div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Blurred background glow for the mockup */}
              <div className="absolute -z-10 bg-indigo-500/20 size- rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none" />
            </div>
          </m.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;