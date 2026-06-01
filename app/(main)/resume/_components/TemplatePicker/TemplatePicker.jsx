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

  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleCreateNew = () => {
    onUseTemplate(selectedTemplate, true); // Pass true to indicate 'clear/fresh start'
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append("file", file);

      // Using dynamic import to avoid module issues if imported at top level
      const { importResumeFromPDF } = await import("@/actions/resume-import");
      const { toast } = await import("sonner");
      
      toast.loading("Analyzing and extracting your resume...", { id: "import" });
      const result = await importResumeFromPDF(formData);
      
      if (result?.error) {
        toast.error(result.error, { id: "import" });
      } else if (result?.data) {
        toast.success("Resume imported successfully!", { id: "import" });
        onUseTemplate(selectedTemplate, false, result.data);
      }
    } catch (error) {
      console.error(error);
      const { toast } = await import("sonner");
      toast.error("Failed to import resume", { id: "import" });
    } finally {
      setIsImporting(false);
      // reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };


  return (
    <div 
      data-testid="template-picker"
      className="flex-1 flex overflow-hidden bg-[#0A0A0F] text-[#F0F0FF] h-full"
    >

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
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button 
                type="button" 
                onClick={handleImportClick}
                disabled={isImporting}
                className="h-9 px-4 bg-transparent hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isImporting ? <Sparkles size={13} className="animate-spin" /> : <Upload size={13} />}
                {isImporting ? "Importing..." : "Import Resume"}
              </button>
              <button 
                type="button" 
                onClick={handleCreateNew}
                className="h-9 px-4 bg-[#6C47FF] hover:bg-[#7C57FF] rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-900/10"
              >
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
