'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { 
  LayoutDashboard, FileText, PenBox, Briefcase, GraduationCap, 
  MessageSquare, CheckSquare, BookOpen, DollarSign, Search, 
  Compass, Plus, Upload, Crown, Sparkles, CheckCircle, ChevronDown
} from 'lucide-react';
import { TEMPLATES } from './templates.data';
import { TemplateCard } from './TemplateCard';
import { FilterTabs } from './FilterTabs';
import { FeaturePills } from './FeaturePills';
import { PreviewPanel } from '../PreviewPanel/PreviewPanel';
import { cn } from '@/lib/utils';

export function TemplatePicker({ onUseTemplate }) {
  const { user } = useUser();
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (activeCategory === 'all') return true;
    return tpl.category.includes(activeCategory);
  });

  const sidebarNavItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={15} />, active: false },
    { label: 'AI Resume Builder', icon: <FileText size={15} />, active: true },
    { label: 'AI Cover Letter', icon: <PenBox size={15} />, active: false },
    { label: 'AI Job Tracker', icon: <Briefcase size={15} />, active: false },
    { label: 'AI Interview Prep', icon: <GraduationCap size={15} />, active: false },
    { label: 'AI Career Coach', icon: <MessageSquare size={15} />, active: false },
    { label: 'Skill Assessment', icon: <CheckSquare size={15} />, active: false },
    { label: 'Learning Hub', icon: <BookOpen size={15} />, active: false },
    { label: 'Salary Insights', icon: <DollarSign size={15} />, active: false },
    { label: 'Job Matcher', icon: <Search size={15} />, active: false },
    { label: 'Career Roadmap', icon: <Compass size={15} />, active: false },
  ];

  return (
    <div 
      data-testid="template-picker"
      className="flex-1 flex overflow-hidden bg-[#0A0A0F] text-[#F0F0FF] h-full"
    >
      {/* 1. Sidebar Nav (Left) */}
      <aside className="w-[200px] border-r border-slate-800 bg-[#0C0C18] flex flex-col justify-between shrink-0 hidden lg:flex">
        {/* Navigation Area */}
        <div className="flex flex-col gap-4 py-4 overflow-y-auto scrollbar-hide">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#4A4A6A] px-5">
            Core Modules
          </div>
          
          <nav className="flex flex-col gap-0.5 px-3">
            {sidebarNavItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 text-[11.5px] font-semibold',
                  item.active
                    ? 'bg-[#1E1030] text-[#A78BFA] border-l-2 border-[#6C47FF] rounded-l-none'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                )}
              >
                <div className={cn('shrink-0', item.active ? 'text-[#A78BFA]' : 'text-slate-500')}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Upgrade Box & Pinned Profile */}
        <div className="p-3 border-t border-slate-800 flex flex-col gap-3">
          {/* Upgrade Box */}
          <div className="bg-[#1A1030] border border-[#3A1A6E] rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A78BFA]">
              <Crown size={12} className="text-amber-400" />
              <span>Upgrade to Pro</span>
            </div>
            <ul className="flex flex-col gap-1 text-[9.5px] text-slate-400">
              <li className="flex items-center gap-1">
                <CheckCircle size={8} className="text-[#6C47FF]" /> Unlimited generations
              </li>
              <li className="flex items-center gap-1">
                <CheckCircle size={8} className="text-[#6C47FF]" /> ATS advanced analysis
              </li>
            </ul>
            <button type="button" className="w-full bg-[#6C47FF] hover:bg-[#7C57FF] text-white font-bold text-[10.5px] py-1.5 rounded-lg transition-colors mt-1">
              Upgrade Now
            </button>
          </div>

          {/* User profile row */}
          <div className="flex items-center gap-2.5 px-2 py-1.5 border-t border-slate-800/60 mt-1">
            <Image
              src={user?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
              alt={user?.fullName || 'User Profile'}
              width={40}
              height={40}
              className="size- rounded-full object-cover ring-1 ring-[#6C47FF]/50"
            />
            <div className="flex flex-col leading-none min-w-0">
              <span className="text-[11px] font-bold text-[#C0C0E0] truncate">{user?.fullName || 'Vishwas Mudagal'}</span>
              <span className="text-[8.5px] text-[#4A4A6A] font-semibold uppercase tracking-wider mt-0.5">Free Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content (Center) */}
      <main className="flex-1 flex flex-col overflow-y-auto p-6 md:p-8 scrollbar-hide bg-[#0A0A0F]">
        <div className="max-w-4xl w-full mx-auto flex flex-col gap-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h1 className="text-[22px] font-black text-white tracking-tight flex items-center gap-2">
                AI Resume Generator
                <Sparkles size={16} className="text-purple-400 animate-pulse" />
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Create a professional, ATS-friendly resume with the power of AI.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button type="button" className="h-9 px-4 bg-transparent hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 transition-colors flex items-center gap-1.5">
                <Upload size={13} />
                Import Resume
              </button>
              <button type="button" className="h-9 px-4 bg-[#6C47FF] hover:bg-[#7C57FF] rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-900/10">
                <Plus size={13} />
                Create New Resume
              </button>
            </div>
          </div>

          {/* Feature Pills */}
          <FeaturePills />

          {/* Divider */}
          <div className="gap-y-">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Choose a Template
            </h2>
            
            {/* Filter Tabs */}
            <FilterTabs 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory}
            />

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={setSelectedTemplate}
                />
              ))}

              {/* More Templates Placeholder Card */}
              <div className="border border-dashed border-slate-800 hover:border-purple-800 bg-[#0A0A0F]/50 rounded-xl p-4 flex flex-col justify-center items-center text-center gap-2.5 min-h-[170px] cursor-pointer transition-all duration-200 group">
                <div className="size- rounded-full bg-slate-900 border border-slate-800 flex justify-center items-center text-slate-400 group-hover:text-purple-400 group-hover:border-purple-900 transition-colors">
                  <Plus size={16} />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-slate-300 group-hover:text-white transition-colors">More Templates</span>
                  <p className="text-[9.5px] text-slate-500 mt-1">20+ premium designs to choose from</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Preview Panel (Right) */}
      <aside className="w-[300px] shrink-0 border-l border-slate-800 bg-[#0C0C18] h-full hidden xl:block">
        <PreviewPanel 
          template={selectedTemplate} 
          onUseTemplate={onUseTemplate}
        />
      </aside>
    </div>
  );
}
