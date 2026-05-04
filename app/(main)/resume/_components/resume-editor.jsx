"use client";

import React, { useEffect } from "react";
import { useResume } from "./resume-provider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Save,
    Download,
    Sparkles,
    Plus,
    Trash2,
    Loader2,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    FolderKanban,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    GripVertical
} from "lucide-react";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableSection = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div {...attributes} {...listeners} className="absolute left-[-26px] top-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab p-1 hover:bg-slate-800 rounded">
                <GripVertical className="h-4 w-4 text-slate-500" />
            </div>
            {children}
        </div>
    );
};

export const ResumeEditor = () => {
    const { resumeData, register, setValue, errors, watch, sectionOrder, setSectionOrder } = useResume();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = sectionOrder.indexOf(active.id);
            const newIndex = sectionOrder.indexOf(over.id);
            setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
        }
    };

    const {
        loading: isImprovingSummary,
        fn: improveWithAIFn,
        data: improvedSummary,
        error: improveError,
    } = useFetch(improveWithAI);

    const handleImproveSummary = async () => {
        const summary = watch("summary");
        if (!summary) {
            toast.error("Please enter a summary first");
            return;
        }

        await improveWithAIFn({
            current: summary,
            type: "summary",
        });
    };

    useEffect(() => {
        if (improvedSummary && !isImprovingSummary) {
            setValue("summary", improvedSummary);
            toast.success("Summary improved successfully!");
        }
        if (improveError) {
            toast.error(improveError.message || "Failed to improve summary");
        }
    }, [improvedSummary, improveError, isImprovingSummary, setValue]);

    const renderHeader = (title, description, icon) => (
        <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20">
                        {icon}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
                    <HelpCircle className="h-4 w-4 text-slate-600 cursor-help" />
                </div>
                <p className="text-sm text-slate-500 ml-14">{description}</p>
            </div>
        </div>
    );

    const renderSection = (id) => {
        switch (id) {
            case "summary":
                return (
                    <div className="space-y-4">
                        {renderHeader("Professional Summary", "A compelling pitch that highlights your key professional achievements.", <Sparkles className="h-5 w-5" />)}
                        <Card className="bg-[#0f0f12] border-slate-800 shadow-xl rounded-2xl overflow-hidden ring-1 ring-slate-800/50">
                            <CardContent className="pt-6 space-y-4">
                                <div className="relative group">
                                    <Textarea
                                        {...register("summary")}
                                        className="min-h-[220px] bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 resize-none text-slate-300 placeholder:text-slate-700 leading-relaxed rounded-xl transition-all duration-300"
                                        placeholder="E.g. Senior Software Engineer with 8+ years of experience in building scalable web applications..."
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute bottom-4 right-4 text-[10px] uppercase font-bold tracking-widest text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-blue-500/10 bg-[#0a0a0c]/80 backdrop-blur"
                                        onClick={handleImproveSummary}
                                        disabled={isImprovingSummary || !watch("summary")}
                                    >
                                        {isImprovingSummary ? (
                                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-3 w-3 mr-2" />
                                        )}
                                        Improve with AI
                                    </Button>
                                </div>
                                {errors.summary && <p className="text-xs text-red-500 font-medium px-2">{errors.summary.message}</p>}
                            </CardContent>
                        </Card>
                    </div>
                );
            case "skills":
                return (
                    <div className="space-y-4">
                        {renderHeader("Skills", "List your primary expertise and technical tools.", <Wrench className="h-5 w-5" />)}
                        <Card className="bg-[#0f0f12] border-slate-800 shadow-xl rounded-2xl overflow-hidden ring-1 ring-slate-800/50">
                            <CardContent className="pt-6">
                                <Textarea
                                    {...register("skills")}
                                    className="min-h-[140px] bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 text-slate-300 placeholder:text-slate-700 rounded-xl leading-relaxed transition-all duration-300"
                                    placeholder="React, Next.js, Node.js, TypeScript, PostgreSQL, Figma, AWS..."
                                />
                                {errors.skills && <p className="text-xs text-red-500 font-medium mt-2 px-2">{errors.skills.message}</p>}
                                <div className="mt-5 flex flex-wrap gap-2.5">
                                    {watch("skills")?.split(",").filter(Boolean).map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-bold text-slate-300 hover:border-slate-700 transition-colors">
                                            {skill.trim()}
                                            <button className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                                                <Plus className="h-3 w-3 rotate-45" />
                                            </button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[10px] uppercase font-bold tracking-widest text-blue-500 hover:bg-blue-500/10 h-8 rounded-lg border border-blue-500/10"
                                    >
                                        <Plus className="h-3 w-3 mr-1.5" /> Suggest Skills
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            case "experience":
                return (
                    <div className="space-y-4">
                        {renderHeader("Work Experience", "Roles that demonstrate your professional growth and impact.", <Briefcase className="h-5 w-5" />)}
                        <EntryForm
                            type="Experience"
                            entries={resumeData.experience}
                            onChange={(entries) => setValue("experience", entries)}
                        />
                    </div>
                );
            case "education":
                return (
                    <div className="space-y-4">
                        {renderHeader("Education", "Your academic qualifications and significant certifications.", <GraduationCap className="h-5 w-5" />)}
                        <EntryForm
                            type="Education"
                            entries={resumeData.education}
                            onChange={(entries) => setValue("education", entries)}
                        />
                    </div>
                );
            case "projects":
                return (
                    <div className="space-y-4">
                        {renderHeader("Projects", "Showcase your personal or professional project portfolio.", <FolderKanban className="h-5 w-5" />)}
                        <EntryForm
                            type="Project"
                            entries={resumeData.projects}
                            onChange={(entries) => setValue("projects", entries)}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-16">
            {/* Personal Details Section */}
            <div className="space-y-4">
                {renderHeader("Personal Details", "How recruiters and automated systems can reach you.", <User className="h-5 w-5" />)}
                <Card className="bg-[#0f0f12] border-slate-800 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-800/50">
                    <CardContent className="pt-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                <Input
                                    {...register("contactInfo.name")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="Jordan Smith"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                <Input
                                    {...register("contactInfo.email")}
                                    type="email"
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="jordan@stripe.com"
                                />
                                {errors.contactInfo?.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1 mt-1">{errors.contactInfo.email.message}</p>}
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Mobile Number</label>
                                <Input
                                    {...register("contactInfo.mobile")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="+1 555-0123"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Professional Role</label>
                                <Input
                                    {...register("industry")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="Software Engineer"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Location</label>
                                <Input
                                    {...register("contactInfo.location")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="New York, NY"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">LinkedIn Profile</label>
                                <Input
                                    {...register("contactInfo.linkedin")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="linkedin.com/in/jordansmith"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Twitter / X Profile</label>
                                <Input
                                    {...register("contactInfo.twitter")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="twitter.com/jordansmith"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    <div className="space-y-16">
                        {sectionOrder.map((id) => (
                            <SortableSection key={id} id={id}>
                                {renderSection(id)}
                            </SortableSection>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};
