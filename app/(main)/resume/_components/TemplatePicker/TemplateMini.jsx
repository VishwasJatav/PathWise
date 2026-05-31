'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export function TemplateMini({ layout, accentColor = '#6C47FF' }) {
  // Render based on layout type
  if (layout === 'two-column' || layout === 'accent-sidebar') {
    return (
      <div className="w-[56px] h-[72px] bg-white rounded-[3px] p-[4px] flex gap-[3px] border border-slate-200 shadow-sm shrink-0">
        {/* Sidebar */}
        <div className="w-[18px] bg-slate-50 rounded-[1px] p-[2px] flex flex-col gap-[2px] border-r border-slate-100">
          <div className="w-full h-[4px] rounded-[0.5px]" style={{ backgroundColor: accentColor }} />
          <div className="w-[80%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[60%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[90%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-full h-[3px] mt-[2px] bg-[#D0D0F0]" />
          <div className="w-[70%] h-[1.5px] bg-[#E0E0E8]" />
        </div>
        {/* Main Body */}
        <div className="flex-1 flex flex-col gap-[2.5px] pt-[2px]">
          <div className="w-[90%] h-[5px] bg-[#0A0A2E] rounded-[0.5px]" />
          <div className="w-[40%] h-[1.5px] bg-[#6C47FF]" />
          <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[80%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[40%] h-[2px] bg-[#6C47FF] mt-[2px]" />
          <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
        </div>
      </div>
    );
  }

  if (layout === 'sidebar') {
    return (
      <div className="w-[56px] h-[72px] bg-white rounded-[3px] p-[4px] flex gap-[3px] border border-slate-200 shadow-sm shrink-0">
        {/* Main Body */}
        <div className="flex-1 flex flex-col gap-[2.5px] pt-[2px]">
          <div className="w-[90%] h-[5px] bg-[#0A0A2E] rounded-[0.5px]" />
          <div className="w-[40%] h-[1.5px] bg-[#6C47FF]" />
          <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[80%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[40%] h-[2px] bg-[#6C47FF] mt-[2px]" />
          <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
        </div>
        {/* Right Sidebar */}
        <div className="w-[18px] bg-slate-50 rounded-[1px] p-[2px] flex flex-col gap-[2px] border-l border-slate-100">
          <div className="w-full h-[4px] rounded-[0.5px]" style={{ backgroundColor: accentColor }} />
          <div className="w-[80%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[60%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[90%] h-[1.5px] bg-[#E0E0E8]" />
        </div>
      </div>
    );
  }

  if (layout === 'accent-header' || layout === 'bold-header' || layout === 'dark-header') {
    const headerBg = layout === 'dark-header' ? '#1E1E2E' : accentColor;
    return (
      <div className="w-[56px] h-[72px] bg-white rounded-[3px] p-[4px] flex flex-col gap-[3px] border border-slate-200 shadow-sm shrink-0 overflow-hidden">
        {/* Header bar */}
        <div className="w-full h-[12px] rounded-[1px] p-[2px] flex flex-col gap-[1.5px] shrink-0" style={{ backgroundColor: headerBg }}>
          <div className="w-[50%] h-[3px] bg-white rounded-[0.3px]" />
          <div className="w-[30%] h-[1.5px] bg-white/60" />
        </div>
        {/* Body content */}
        <div className="flex-1 flex flex-col gap-[2px] pt-[2px]">
          <div className="w-[40%] h-[2px] bg-[#6C47FF]" />
          <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[95%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[80%] h-[1.5px] bg-[#E0E0E8]" />
          <div className="w-[40%] h-[2px] bg-[#6C47FF] mt-[2px]" />
          <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
        </div>
      </div>
    );
  }

  // Classic Single-column layout (default)
  return (
    <div className="w-[56px] h-[72px] bg-white rounded-[3px] p-[4px] flex flex-col gap-[2px] border border-slate-200 shadow-sm shrink-0">
      <div className="w-full h-[8px] bg-[#0A0A2E] rounded-[0.5px] shrink-0" />
      <div className="w-[40%] h-[3px] bg-[#6C47FF] mt-[2px] shrink-0" />
      <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
      <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
      <div className="w-[70%] h-[1.5px] bg-[#E0E0E8]" />
      <div className="w-[40%] h-[3px] bg-[#6C47FF] mt-[2px] shrink-0" />
      <div className="w-full h-[1.5px] bg-[#E0E0E8]" />
      <div className="w-[85%] h-[1.5px] bg-[#E0E0E8]" />
    </div>
  );
}
