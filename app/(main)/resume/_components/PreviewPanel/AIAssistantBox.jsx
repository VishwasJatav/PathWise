'use client';
import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useResume } from '../resume-provider';
import { generateFullResumeWithAI } from '@/actions/resume';
import { toast } from 'sonner';

export function AIAssistantBox({ template }) {
  const { resumeData, reset } = useResume();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      toast.loading("AI is writing your resume...", { id: "generate-ai" });
      
      const result = await generateFullResumeWithAI(resumeData);
      
      if (result?.error) {
        toast.error(result.error, { id: "generate-ai" });
      } else if (result?.data) {
        reset(result.data);
        toast.success("Resume generated successfully!", { id: "generate-ai" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate resume", { id: "generate-ai" });
    } finally {
      setIsGenerating(false);
    }
  };

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
      <button 
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        data-testid="generate-ai-btn"
        className="w-full bg-[#6C47FF] hover:bg-[#7C57FF] text-white font-bold text-[11px] py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
      >
        {isGenerating ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
        {isGenerating ? "Generating..." : "Generate with AI"}
      </button>
    </div>
  );
}
