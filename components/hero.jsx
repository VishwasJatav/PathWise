"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Building2, Terminal, Briefcase, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setStep(1); // Show typed query
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2); // Show analyzing state
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3); // Show final answer
    };
    sequence();
  }, []);

  return (
    <section className="w-full pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden relative">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center md:text-left z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Text Content */}
          <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              PathWise AI Career Architect 2.0
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl xl:text-8xl text-foreground"
            >
              Navigate your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">career trajectory.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed"
            >
              Stop guessing what employers want. Let our advanced AI analyze market data, simulate interviews, and build your perfect ATS-optimized resume.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
                  Start Architecting
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Perplexity-style Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-xl mx-auto lg:ml-auto perspective-1000"
          >
            <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl p-6 ring-1 ring-white/10 overflow-hidden group">

              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-6">
                {/* Search Bar Simulation */}
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 shadow-inner">
                  <Search className="h-5 w-5 text-indigo-400" />
                  <div className="flex-1 text-left relative h-6">
                    <AnimatePresence mode="wait">
                      {step === 0 && (
                        <motion.span
                          key="typing-indicator"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-muted-foreground text-sm flex items-center h-full"
                        >
                          Ask anything... <span className="w-1.5 h-4 bg-muted-foreground ml-1 animate-pulse" />
                        </motion.span>
                      )}
                      {step >= 1 && (
                        <motion.span
                          key="typed-query"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-foreground text-sm font-medium flex items-center h-full"
                        >
                          How do I transition from Marketing to Tech inside 6 months?
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* AI Response Area */}
                <div className="min-h-[220px]">
                  <AnimatePresence mode="wait">
                    {step === 2 && (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 text-sm text-indigo-400 h-[220px]"
                      >
                        <Sparkles className="h-5 w-5 animate-spin-slow" />
                        Synthesizing market trends & skill gaps...
                      </motion.div>
                    )}

                    {step >= 3 && (
                      <motion.div
                        key="answer"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-sm text-gray-200 leading-relaxed font-medium">
                              Based on current 2025 market data, a transition from Marketing to Tech is highly viable if you target <span className="text-indigo-300">Growth Product Management</span> or <span className="text-indigo-300">Developer Relations</span>.
                            </p>

                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                                <Terminal className="h-4 w-4 text-pink-400" />
                                <span className="text-xs text-gray-300">Learn SQL & Python</span>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                                <Building2 className="h-4 w-4 text-purple-400" />
                                <span className="text-xs text-gray-300">Target SaaS Startups</span>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground pt-1 flex items-center">
                              <Briefcase className="h-3 w-3 mr-1" />
                              Estimated salary bump: +24% to 35%
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Blurred background glow for the mockup */}
              <div className="absolute -z-10 bg-indigo-500/20 w-48 h-48 rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;