'use client';
import React from 'react';
import { Crown, ShieldCheck, ArrowRight } from 'lucide-react';
import { ResumeDocPreview } from './ResumeDocPreview';
import { AIAssistantBox } from './AIAssistantBox';
import { StatsRow } from './StatsRow';

export function PreviewPanel({ template, onUseTemplate }) {
  if (!template) return (
    <div className="flex items-center justify-center h-full text-[#4A4A6A] text-xs font-bold uppercase tracking-wider bg-[#0C0C18]" data-testid="preview-panel">
      Select a template to preview
    </div>
  );

  const atsColor = template.ats >= 92 
    ? 'text-green-400 bg-green-950/50 border-green-900' 
    : 'text-amber-400 bg-amber-950/50 border-amber-900';

  return (
    <div className="flex flex-col h-full bg-[#0C0C18] border-l border-slate-800" data-testid="preview-panel">
      {/* Header */}
      <div className="px-4 h-[52px] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#D0D0F0]" data-testid="preview-template-name">{template.name}</span>
          {template.tier === 'premium' && (
            <span className="bg-[#1A1030] border border-[#3A1A6E] rounded px-1.5 py-0.5 text-[9px] font-bold text-[#A78BFA] flex items-center gap-1 shrink-0">
              <Crown size={8} className="text-amber-400" /> PRO
            </span>
          )}
        </div>
        <span 
          className="bg-[#0A200A] border border-[#1A5A1A] rounded px-2.5 py-1 text-[11px] font-black text-green-400 flex items-center gap-1.5 shrink-0"
          data-testid="preview-ats-score"
        >
          <ShieldCheck size={11} />
          {template.ats}% ATS Match
        </span>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide">
        <ResumeDocPreview template={template} />

        <button type="button"
          data-testid="use-template-btn"
          onClick={() => onUseTemplate(template)}
          className="w-full bg-[#6C47FF] hover:bg-[#7C57FF] text-white font-bold text-[12.5px] py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-purple-900/10 shrink-0"
        >
          <span>Use This Template</span>
          <ArrowRight size={14} />
        </button>

        <AIAssistantBox template={template} />
        <StatsRow ats={template.ats} />
      </div>
    </div>
  );
}
