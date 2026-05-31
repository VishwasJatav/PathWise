'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export function ResumeDocPreview({ template }) {
  const accentColor = template?.accentColor || '#6C47FF';
  const layout = template?.layout || 'single-column';

  // Renders a miniature resume page on a white paper background
  return (
    <div className="w-full aspect-[210/297] bg-white rounded-lg p-5 shadow-2xl border border-slate-800/20 text-slate-800 flex flex-col gap-3 overflow-hidden select-none">
      {layout === 'two-column' || layout === 'accent-sidebar' ? (
        <div className="flex-1 flex gap-3 h-full">
          {/* Sidebar */}
          <div className="w-1/3 bg-slate-50 rounded p-2 flex flex-col gap-2.5 border-r border-slate-100">
            <div className="flex flex-col gap-1">
              <div className="size- rounded-full bg-slate-200 shrink-0" />
              <div className="w-[85%] h-2.5 rounded bg-slate-300 mt-1" />
              <div className="w-[60%] h-1.5 rounded bg-slate-200" />
            </div>
            
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="w-[50%] h-2 rounded" style={{ backgroundColor: accentColor }} />
              <div className="w-full h-1.5 rounded bg-slate-200" />
              <div className="w-[85%] h-1.5 rounded bg-slate-200" />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <div className="w-[60%] h-2 rounded" style={{ backgroundColor: accentColor }} />
              <div className="w-[90%] h-1.5 rounded bg-slate-200" />
              <div className="w-[70%] h-1.5 rounded bg-slate-200" />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col gap-3 pt-1">
            <div className="border-b border-slate-100 pb-2">
              <div className="w-[70%] h-4 rounded bg-slate-900" />
              <div className="w-[45%] h-2 rounded bg-slate-400 mt-1" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="w-[40%] h-2.5 rounded" style={{ backgroundColor: accentColor }} />
              <div className="w-[95%] h-1.5 rounded bg-slate-200" />
              <div className="w-full h-1.5 rounded bg-slate-200" />
              <div className="w-[80%] h-1.5 rounded bg-slate-200" />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <div className="w-[50%] h-2.5 rounded" style={{ backgroundColor: accentColor }} />
              <div className="w-full h-1.5 rounded bg-slate-200" />
              <div className="w-[90%] h-1.5 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ) : layout === 'sidebar' ? (
        <div className="flex-1 flex gap-3 h-full">
          {/* Body */}
          <div className="flex-1 flex flex-col gap-3 pt-1">
            <div className="border-b border-slate-100 pb-2">
              <div className="w-[70%] h-4 rounded bg-slate-900" />
              <div className="w-[45%] h-2 rounded bg-slate-400 mt-1" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="w-[40%] h-2.5 rounded" style={{ backgroundColor: accentColor }} />
              <div className="w-[95%] h-1.5 rounded bg-slate-200" />
              <div className="w-full h-1.5 rounded bg-slate-200" />
              <div className="w-[80%] h-1.5 rounded bg-slate-200" />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <div className="w-[50%] h-2.5 rounded" style={{ backgroundColor: accentColor }} />
              <div className="w-full h-1.5 rounded bg-slate-200" />
              <div className="w-[90%] h-1.5 rounded bg-slate-200" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-1/3 bg-slate-50 rounded p-2 flex flex-col gap-2.5 border-l border-slate-100">
            <div className="flex flex-col gap-1">
              <div className="size- rounded-full bg-slate-200 shrink-0" />
              <div className="w-[85%] h-2.5 rounded bg-slate-300 mt-1" />
              <div className="w-[60%] h-1.5 rounded bg-slate-200" />
            </div>
            
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="w-[50%] h-2 rounded" style={{ backgroundColor: accentColor }} />
              <div className="w-full h-1.5 rounded bg-slate-200" />
              <div className="w-[85%] h-1.5 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ) : (
        // Single-column & Accent header layouts
        <div className="flex-1 flex flex-col gap-3.5">
          {/* Header */}
          <div className={cn(
            "p-3 rounded flex flex-col items-center justify-center gap-1 shrink-0",
            layout === 'dark-header' && 'bg-slate-900 text-white',
            layout === 'bold-header' && 'bg-gradient-to-r from-purple-600 to-blue-500 text-white',
            layout === 'accent-header' && 'border-t-4 border-slate-900 bg-slate-50'
          )}>
            <div className="w-[60%] h-4 rounded bg-slate-900 mx-auto" style={{ backgroundColor: layout.includes('header') && layout !== 'accent-header' ? '#FFFFFF' : '#0F0F1A' }} />
            <div className="w-[40%] h-1.5 rounded bg-slate-400 mx-auto mt-0.5" />
          </div>

          {/* Profile Section */}
          <div className="flex flex-col gap-1 px-1">
            <div className="w-[25%] h-2 rounded" style={{ backgroundColor: accentColor }} />
            <div className="w-full h-1.5 rounded bg-slate-200" />
            <div className="w-[90%] h-1.5 rounded bg-slate-200" />
          </div>

          {/* Work Experience */}
          <div className="flex flex-col gap-2 mt-1 px-1">
            <div className="w-[30%] h-2 rounded" style={{ backgroundColor: accentColor }} />
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="w-[50%] h-1.5 rounded bg-slate-500 font-bold" />
                <div className="w-[20%] h-1.5 rounded bg-slate-300" />
              </div>
              <div className="w-[95%] h-1.5 rounded bg-slate-200" />
              <div className="w-[80%] h-1.5 rounded bg-slate-200" />
            </div>
          </div>

          {/* Education */}
          <div className="flex flex-col gap-1.5 mt-1 px-1">
            <div className="w-[25%] h-2 rounded" style={{ backgroundColor: accentColor }} />
            <div className="w-full h-1.5 bg-slate-200 rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
