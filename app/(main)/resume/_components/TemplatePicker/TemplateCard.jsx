'use client';
import React from 'react';
import { Crown } from 'lucide-react';
import { TemplateMini } from './TemplateMini';
import { cn } from '@/lib/utils';

export function TemplateCard({ template, isSelected, onSelect }) {
  const atsColor = template.ats >= 92
    ? 'text-green-400 bg-green-950/50 border-green-900'
    : 'text-amber-400 bg-amber-950/50 border-amber-900';

  return (
    <div
      data-testid={`template-card-${template.id}`}
      onClick={() => onSelect(template)}
      className={cn(
        'bg-[#0F0F1A] rounded-xl overflow-hidden cursor-pointer transition-all duration-200',
        'border hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-950/5',
        isSelected
          ? 'border-[#6C47FF] border-2 shadow-[0_0_15px_rgba(108,71,255,0.2)]'
          : 'border-[#1E1E2E] hover:border-[#3A2A6E]'
      )}
    >
      {/* Thumbnail */}
      <div className="h-[100px] bg-[#141420] relative flex items-center justify-center overflow-hidden">
        <span className={cn(
          'absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded border',
          atsColor
        )}>
          {template.ats}% ATS Match
        </span>
        {template.tier === 'premium' && (
          <span className="absolute top-2 right-2 bg-[#1A1030] border border-[#3A1A6E] rounded px-1.5 py-0.5 flex items-center gap-1 text-[9px] font-bold text-[#A78BFA]">
            <Crown size={8} className="text-amber-400 shrink-0" />
            PRO
          </span>
        )}
        <TemplateMini layout={template.layout} accentColor={template.accentColor} />
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[12.5px] font-bold text-[#D0D0F0]">{template.name}</span>
          <span className={cn('text-[9.5px] font-bold px-1.5 py-0.5 rounded border scale-95 origin-left', atsColor)}>
            {template.ats}% ATS
          </span>
        </div>
        <p className="text-[10.5px] text-[#5A5A7A] line-clamp-1">{template.description}</p>
      </div>
    </div>
  );
}
