'use client';
import React, { useEffect, useState } from 'react';

export function StatsRow({ ats = 90 }) {
  const [animatedAts, setAnimatedAts] = useState(0);

  useEffect(() => {
    const duration = 800; // ms
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = ats / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= ats) {
        setAnimatedAts(ats);
        clearInterval(timer);
      } else {
        setAnimatedAts(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [ats]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* ATS score prediction */}
      <div className="bg-[#0F0F1A] border border-slate-800 rounded-lg p-2 flex flex-col justify-center items-center text-center">
        <span className="text-[13px] font-black text-emerald-400 leading-none">{animatedAts}%</span>
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">ATS Score</span>
      </div>

      {/* AI Content Suggestions */}
      <div className="bg-[#0F0F1A] border border-slate-800 rounded-lg p-2 flex flex-col justify-center items-center text-center">
        <span className="text-[13px] font-black text-purple-400 leading-none">Smart</span>
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">AI Content</span>
      </div>

      {/* Live Preview */}
      <div className="bg-[#0F0F1A] border border-slate-800 rounded-lg p-2 flex flex-col justify-center items-center text-center">
        <span className="text-[13px] font-black text-sky-400 leading-none">Active</span>
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Live Preview</span>
      </div>
    </div>
  );
}
