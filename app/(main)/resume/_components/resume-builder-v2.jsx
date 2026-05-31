"use client";

import React, { useEffect } from "react";
import { ResumeProvider, useResume } from "./resume-provider";
import { ResumeEditor } from "./resume-editor";
import { ResumePreview } from "./resume-preview";
import { Button } from "@/components/ui/button";
import { Save, Download, Maximize2, Palette, ArrowLeft } from "lucide-react";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { cn } from "@/lib/utils";
import { useLoading } from "@/components/providers/loading-provider";
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
import { TemplatePicker } from "./TemplatePicker/TemplatePicker";
import { TEMPLATES } from "./TemplatePicker/templates.data";

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
    const [mode, setMode] = React.useState("pick"); // "pick" | "edit"
    const [selectedPickerTemplate, setSelectedPickerTemplate] = React.useState(TEMPLATES[0]);
    const [activeTab, setActiveTab] = React.useState("edit"); // "edit" | "preview" on mobile
    const { startLoading, stopLoading } = useLoading();

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError,
    } = useFetch(saveResume);

    const generatePDF = async () => {
        setIsGenerating(true);
        startLoading("ai", "Generating premium PDF document...");
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
            stopLoading();
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

    const handleUseTemplate = (selectedTpl) => {
        let editorTemplateId = "classic";
        if (selectedTpl.id === "zenith") editorTemplateId = "minimal";
        else if (selectedTpl.id === "momentum" || selectedTpl.id === "impact") editorTemplateId = "modern";
        else if (selectedTpl.id === "vertex-pro" || selectedTpl.id === "elite") editorTemplateId = "creative";
        
        setTemplate(editorTemplateId);
        setSelectedPickerTemplate(selectedTpl);
        setMode("edit");
    };

    // Mode 1: Template Picker
    if (mode === "pick") {
        return (
            <TemplatePicker onUseTemplate={handleUseTemplate} />
        );
    }

    // Mode 2: Resume Editor
    return (
        <div data-testid="resume-editor" className="flex flex-col h-full bg-[#0a0a0c] text-slate-200 overflow-hidden">
            {/* Focused Editor Toolbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0F0F1A] backdrop-blur-md shrink-0">
                <div className="px-6 flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Back Button */}
                        <Button type="button"
                            data-testid="back-to-picker-btn"
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-200 gap-1.5 px-3 border border-slate-800 bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider h-9 rounded-lg transition-all"
                            onClick={() => setMode("pick")}
                        >
                            <ArrowLeft size={14} />
                            <span>Templates</span>
                        </Button>

                        <div className="h-4 w-px bg-slate-800" />

                        {/* Template name */}
                        <div className="text-xs font-bold text-slate-300">
                            Template: <span className="text-white font-extrabold">{selectedPickerTemplate?.name || "Apex Pro"}</span>
                        </div>

                        <div className="h-4 w-px bg-slate-800" />

                        {/* Auto-save Status */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800" data-testid="autosave-indicator">
                            <div className={`size- rounded-full ${isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {isSaving ? "Saving..." : formatLastSaved(lastSavedAt)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Template Selector */}
                        <Select 
                            value={selectedPickerTemplate?.id || "apex-pro"} 
                            onValueChange={(val) => {
                                const found = TEMPLATES.find(t => t.id === val);
                                if (found) {
                                    handleUseTemplate(found);
                                }
                            }}
                        >
                            <SelectTrigger className="h-9 w-[180px] bg-slate-900 border-slate-800 text-xs font-semibold hover:border-slate-700 transition-all px-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Palette className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                                    <SelectValue placeholder="Templates" className="truncate text-slate-200" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                {TEMPLATES.map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button type="button"
                            data-testid="export-pdf-btn"
                            size="sm"
                            onClick={generatePDF}
                            disabled={isGenerating}
                            className="h-9 bg-[#6C47FF] hover:bg-[#7C57FF] text-white border-none shadow-lg shadow-purple-900/20 px-4 font-bold text-xs uppercase tracking-widest transition-all"
                        >
                            {isGenerating ? (
                                <Button type="button"Loader className="mr-2" />
                            ) : (
                                <Download className="h-3.5 w-3.5 mr-2" />
                            )}
                            {isGenerating ? "Exporting..." : "Export PDF"}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Tab Switcher for Mobile */}
            <div className="flex md:hidden border-b border-slate-800 bg-[#0f0f12] p-2 justify-center gap-2 shrink-0">
                <Button type="button"
                    variant={activeTab === "edit" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                        "h-8 text-xs font-bold uppercase tracking-widest px-4",
                        activeTab === "edit" ? "bg-blue-600 hover:bg-blue-500 text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                    onClick={() => setActiveTab("edit")}
                >
                    Edit
                </Button>
                <Button type="button"
                    variant={activeTab === "preview" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                        "h-8 text-xs font-bold uppercase tracking-widest px-4",
                        activeTab === "preview" ? "bg-blue-600 hover:bg-blue-500 text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                    onClick={() => setActiveTab("preview")}
                >
                    Preview
                </Button>
            </div>

            {/* Main Content Split */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black">
                {/* Left Panel: Editor (45%) */}
                <div 
                    data-testid="editor-panel"
                    className={cn(
                        "w-full md:w-[45%] h-full overflow-y-auto p-6 md:p-12 border-r border-slate-800 bg-neutral-950 scrollbar-hide",
                        activeTab !== "edit" && "hidden md:block"
                    )}
                >
                    <div className="max-w-4xl mx-auto gap-y- pb-32">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Workspace</p>
                                <h1 className="text-2xl font-bold text-white">Resume Editor</h1>
                            </div>
                        </div>
                        <ResumeEditor />
                    </div>
                </div>

                {/* Right Panel: Preview Area (55%) */}
                <div 
                    data-testid="live-preview"
                    className={cn(
                        "w-full md:w-[55%] h-full flex flex-col bg-neutral-900 relative overflow-hidden",
                        activeTab !== "preview" && "hidden md:flex"
                    )}
                >
                    {/* Preview Controls */}
                    <div className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f0f12]/40 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                                <Button type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size- text-slate-400 hover:text-white"
                                    onClick={() => setZoom(Math.max(50, zoom - 5))}
                                >
                                    <span className="text-lg font-light">-</span>
                                </Button>
                                <span className="text-[10px] font-bold text-slate-300 w-8 text-center">{zoom}%</span>
                                <Button type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size- text-slate-400 hover:text-white"
                                    onClick={() => setZoom(Math.min(150, zoom + 5))}
                                >
                                    <span className="text-lg font-light">+</span>
                                </Button>
                            </div>

                            <Button type="button"
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
                                    <Button type="button" variant="ghost" size="icon" className="size- text-slate-500 hover:text-slate-200">
                                        <Maximize2 className="size-" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] h-[95vh] p-0 flex flex-col bg-[#0a0a0c] border-slate-800">
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0f0f12] shrink-0">
                                        <div className="flex items-center gap-4">
                                            <h2 className="font-bold text-slate-200 uppercase tracking-tighter text-sm">Resume Preview</h2>
                                            <div className="flex items-center gap-2">
                                                <Select 
                                                    value={selectedPickerTemplate?.id || "apex-pro"} 
                                                    onValueChange={(val) => {
                                                        const found = TEMPLATES.find(t => t.id === val);
                                                        if (found) {
                                                            handleUseTemplate(found);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800">
                                                        {TEMPLATES.map(t => (
                                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button type="button" size="sm" variant="outline" onClick={generatePDF} disabled={isGenerating} className="border-slate-800 bg-slate-900">
                                                {isGenerating ? <Button type="button"Loader className="mr-1.5" /> : <Download className="size- mr-1" />}
                                                {isGenerating ? "Exporting" : "Download"}
                                            </Button>
                                            <DialogClose asChild>
                                                <Button type="button" size="sm" variant="secondary" className="bg-slate-800 text-white">Close</Button>
                                            </DialogClose>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-[#121216] p-8 flex justify-center">
                                        <ResumePreview isModal={true} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col gap-4 justify-start items-center scrollbar-hide">
                        <div className="w-full max-w-[210mm] px-1">
                            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Live Preview</p>
                            <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
                        </div>
                        <div className="w-full flex justify-center">
                            <ResumePreview isModal={false} />
                        </div>
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
