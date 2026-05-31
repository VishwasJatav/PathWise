'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Professional', 'Creative', 'Modern', 'Academic', 'Tech'];

export function FilterTabs({ activeCategory, onSelectCategory, activeSort = 'Premium First' }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5" data-testid="template-filters">
        {CATEGORIES.map((category) => {
          const id = category.toLowerCase();
          const isActive = activeCategory === id;
          return (
            <button type="button"
              key={category}
              data-testid={`template-filter-${id}`}
              onClick={() => onSelectCategory(id)}
              className={cn(
                'px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all duration-150',
                isActive
                  ? 'bg-[#1E1030] text-[#A78BFA] border-[#3A1A6E]'
                  : 'border-slate-800 bg-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown (Mock) */}
      <button type="button" className="flex items-center gap-2 px-3 py-1.5 bg-[#0F0F1A] border border-slate-800 rounded-lg text-[11px] font-bold text-slate-400 hover:text-slate-200 transition-colors self-start sm:self-auto">
        <span>{activeSort}</span>
        <ChevronDown size={12} className="text-slate-500" />
      </button>
    </div>
  );
}
