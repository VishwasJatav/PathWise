"use client";

import React from "react";
import { ResumeProvider, useResume } from "./resume-provider";
import { ResumeEditor } from "./resume-editor";
import { ResumePreview } from "./resume-preview";
import { Button } from "@/components/ui/button";
import { Save, Download, Maximize2, Palette, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

import useFetch from "@/hooks/use-fetch";
import { saveResume } from "@/actions/resume";
import { toast } from "sonner";
import { useEffect } from "react";

const BuilderShell = () => {
    const {
        template,
        setTemplate,
        resumeData,
        initialData,
        handleSubmit,
        zoom,
        setZoom,
        lastSavedAt,
        setLastSavedAt
    } = useResume();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError,
    } = useFetch(saveResume);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;
            const element = document.getElementById("resume-content");
            const opt = {
                margin: [0, 0],
                filename: "resume.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsGenerating(false);
        }
    };

    const onSave = async (data) => {
        await saveResumeFn(data);
    };

    useEffect(() => {
        if (saveResult && !isSaving) {
            setLastSavedAt(new Date());
            toast.success("Resume saved successfully!");
        }
        if (saveError) {
            toast.error(saveError.message || "Failed to save resume");
        }
    }, [saveResult, saveError, isSaving, setLastSavedAt]);

    // Auto-save logic
    useEffect(() => {
        if (JSON.stringify(resumeData) !== JSON.stringify(initialData)) {
            const timer = setTimeout(() => {
                handleSubmit(onSave)();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [resumeData, handleSubmit, initialData]);

    const formatLastSaved = (date) => {
        if (!date) return "Not saved yet";
        const diff = Math.floor((new Date() - date) / 1000);
        if (diff < 60) return "Just now";
        return `Auto-saved ${Math.floor(diff / 60)}m ago`;
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-200">
            {/* Focused Editor Toolbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-neutral-950/90 backdrop-blur-md">
                <div className="px-6 flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Auto-save Status */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800">
                            <div className={`h-2 w-2 rounded-full ${isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {isSaving ? "Saving..." : formatLastSaved(lastSavedAt)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Template Selector */}
                        <Select value={template} onValueChange={setTemplate}>
                            <SelectTrigger className="h-9 w-[180px] bg-slate-900 border-slate-800 text-xs font-semibold hover:border-slate-700 transition-all px-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Palette className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                    <SelectValue placeholder="Templates" className="truncate" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                <SelectItem value="classic">Classic Professional</SelectItem>
                                <SelectItem value="modern">Modern Tech</SelectItem>
                                <SelectItem value="minimal">Minimal ATS</SelectItem>
                                <SelectItem value="creative">Creative Designer</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            size="sm"
                            onClick={generatePDF}
                            disabled={isGenerating}
                            className="h-9 bg-blue-600 hover:bg-blue-500 text-white border-none shadow-lg shadow-blue-900/20 px-4 font-bold text-xs uppercase tracking-widest"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Download className="h-3.5 w-3.5 mr-2" />
                            )}
                            {isGenerating ? "" : "Export PDF"}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Split */}
            <main className="flex-1 flex overflow-hidden bg-black">
                {/* Left Panel: Editor (60%) */}
                <div className="w-[60%] overflow-y-auto p-12 border-r border-slate-800 bg-neutral-950 scrollbar-hide">
                    <div className="max-w-4xl mx-auto space-y-12 pb-32">
                        <ResumeEditor />
                    </div>
                </div>

                {/* Right Panel: Preview Area (40%) */}
                <div className="w-[40%] flex flex-col bg-neutral-900 relative">
                    {/* Preview Controls */}
                    <div className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f0f12]/40">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:text-white"
                                    onClick={() => setZoom(Math.max(50, zoom - 5))}
                                >
                                    <span className="text-lg font-light">-</span>
                                </Button>
                                <span className="text-[10px] font-bold text-slate-300 w-8 text-center">{zoom}%</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:text-white"
                                    onClick={() => setZoom(Math.min(150, zoom + 5))}
                                >
                                    <span className="text-lg font-light">+</span>
                                </Button>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] uppercase font-bold tracking-widest px-3 border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                                onClick={() => setZoom(75)}
                            >
                                FIT
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-200">
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] h-[95vh] p-0 flex flex-col bg-[#0a0a0c] border-slate-800">
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0f0f12] shrink-0">
                                        <div className="flex items-center gap-4">
                                            <h2 className="font-bold text-slate-200 uppercase tracking-tighter text-sm">Resume Preview</h2>
                                            <div className="flex items-center gap-2">
                                                <Select value={template} onValueChange={setTemplate}>
                                                    <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-900 border-slate-800">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800">
                                                        <SelectItem value="classic">Classic Professional</SelectItem>
                                                        <SelectItem value="modern">Modern Tech</SelectItem>
                                                        <SelectItem value="minimal">Minimal ATS</SelectItem>
                                                        <SelectItem value="creative">Creative Designer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" onClick={generatePDF} disabled={isGenerating} className="border-slate-800 bg-slate-900">
                                                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Download className="h-3 w-3 mr-1" />}
                                                Download
                                            </Button>
                                            <DialogClose asChild>
                                                <Button size="sm" variant="secondary" className="bg-slate-800 text-white">Close</Button>
                                            </DialogClose>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-[#121216] p-8 flex justify-center">
                                        <ResumePreview />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 flex justify-center items-start scrollbar-hide">
                        <ResumePreview />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default function ResumeBuilder({ initialData, onSave, isSaving }) {
    return (
        <ResumeProvider initialData={initialData}>
            <BuilderShell onSave={onSave} isSaving={isSaving} />
        </ResumeProvider>
    );
}
