'use client';
import React from 'react';
import { ShieldCheck, Sparkles, Briefcase } from 'lucide-react';

export function FeaturePills() {
  const pills = [
    {
      icon: <ShieldCheck className="h-4.5 w-4.5 text-[#6C47FF] shrink-0" />,
      label: 'ATS Optimized',
      sub: 'High ATS score templates',
    },
    {
      icon: <Sparkles className="h-4.5 w-4.5 text-[#6C47FF] shrink-0" />,
      label: 'AI-Powered Content',
      sub: 'Smart suggestions',
    },
    {
      icon: <Briefcase className="h-4.5 w-4.5 text-[#6C47FF] shrink-0" />,
      label: 'Industry Specific',
      sub: 'Tailored examples',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {pills.map((pill, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 px-3.5 py-2.5 bg-[#0F0F1A] border border-slate-800 rounded-xl"
        >
          {pill.icon}
          <div className="flex flex-col leading-none">
            <span className="text-[11.5px] font-bold text-[#C0C0E0]">{pill.label}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">{pill.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
