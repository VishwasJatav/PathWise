'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';

export function AIAssistantBox({ template }) {
  return (
    <div className="bg-[#0F0F1A] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
          <Sparkles size={14} />
        </div>
        <span className="text-[12px] font-bold text-slate-200">AI Assistant</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed">
        Let AI write, format, and optimize your resume for the <strong className="text-slate-300">{template?.name || 'selected'}</strong> template style.
      </p>
      <button type="button"
        data-testid="generate-ai-btn"
        className="w-full bg-[#6C47FF] hover:bg-[#7C57FF] text-white font-bold text-[11px] py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
      >
        <Sparkles size={11} />
        Generate with AI
      </button>
    </div>
  );
}
