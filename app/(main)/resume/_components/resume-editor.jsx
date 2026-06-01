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
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { useLoading } from "@/components/providers/loading-provider";
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
                <GripVertical className="size- text-slate-500" />
            </div>
            {children}
        </div>
    );
};

export const EditorHeader = ({ title, description, icon }) => (
    <div className="flex items-start justify-between mb-6">
        <div className="gap-y-">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20">
                    {icon}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
                <HelpCircle className="size- text-slate-600 cursor-help" />
            </div>
            <p className="text-sm text-slate-500 ml-14">{description}</p>
        </div>
    </div>
);

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

    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        if (isImprovingSummary) {
            startLoading("ai", "Analyzing and polishing your professional summary...");
        } else {
            stopLoading();
        }
    }, [isImprovingSummary]);

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

    // renderHeader extracted to a separate component

    const renderSection = (id) => {
        switch (id) {
            case "summary":
                return (
                    <div className="gap-y-">
                        <EditorHeader title="Professional Summary" description="A compelling pitch that highlights your key professional achievements." icon={<Sparkles className="size-" />} />
                        <Card className="bg-[#0f0f12] border-slate-800 shadow-xl rounded-2xl overflow-hidden ring-1 ring-slate-800/50">
                            <CardContent className="pt-6 gap-y-">
                                <div className="relative group">
                                    <Textarea
                                        {...register("summary")}
                                        className="min-h-[220px] bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 resize-none text-slate-300 placeholder:text-slate-700 leading-relaxed rounded-xl transition-all duration-300"
                                        placeholder="E.g. Senior Software Engineer with 8+ years of experience in building scalable web applications..."
                                    />
                                    <Button type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute bottom-4 right-4 text-[10px] uppercase font-bold tracking-widest text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-blue-500/10 bg-[#0a0a0c]/80 backdrop-blur"
                                        onClick={handleImproveSummary}
                                        disabled={isImprovingSummary || !watch("summary")}
                                    >
                                        {isImprovingSummary ? (
                                            <ButtonLoader className="mr-2" />
                                        ) : (
                                            <Sparkles className="size- mr-2" />
                                        )}
                                        {isImprovingSummary ? "Improving..." : "Improve with AI"}
                                    </Button>
                                </div>
                                {errors.summary && <p className="text-xs text-red-500 font-medium px-2">{errors.summary.message}</p>}
                            </CardContent>
                        </Card>
                    </div>
                );
            case "skills":
                return (
                    <div className="gap-y-">
                        <EditorHeader title="Skills" description="List your primary expertise and technical tools." icon={<Wrench className="size-" />} />
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
                                        <div key={skill.trim()} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-bold text-slate-300 hover:border-slate-700 transition-colors">
                                            {skill.trim()}
                                            <button type="button" className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                                                <Plus className="size- rotate-45" />
                                            </button>
                                        </div>
                                    ))}
                                    <Button type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-[10px] uppercase font-bold tracking-widest text-blue-500 hover:bg-blue-500/10 h-8 rounded-lg border border-blue-500/10"
                                    >
                                        <Plus className="size- mr-1.5" /> Suggest Skills
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            case "experience":
                return (
                    <div className="gap-y-">
                        <EditorHeader title="Work Experience" description="Roles that demonstrate your professional growth and impact." icon={<Briefcase className="size-" />} />
                        <EntryForm
                            type="Experience"
                            entries={resumeData.experience}
                            onChange={(entries) => setValue("experience", entries)}
                        />
                    </div>
                );
            case "education":
                return (
                    <div className="gap-y-">
                        <EditorHeader title="Education" description="Your academic qualifications and significant certifications." icon={<GraduationCap className="size-" />} />
                        <EntryForm
                            type="Education"
                            entries={resumeData.education}
                            onChange={(entries) => setValue("education", entries)}
                        />
                    </div>
                );
            case "projects":
                return (
                    <div className="gap-y-">
                        <EditorHeader title="Projects" description="Showcase your personal or professional project portfolio." icon={<FolderKanban className="size-" />} />
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
        <div className="gap-y-">
            {/* Personal Details Section */}
            <div className="gap-y-">
                <EditorHeader title="Personal Details" description="How recruiters and automated systems can reach you." icon={<User className="size-" />} />
                <Card className="bg-[#0f0f12] border-slate-800 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-800/50">
                    <CardContent className="pt-8 gap-y-">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="gap-y-">
                                <label htmlFor="contactInfo.name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                <Input
                                    id="contactInfo.name"
                                    {...register("contactInfo.name")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="Jordan Smith"
                                />
                            </div>
                            <div className="gap-y-">
                                <label htmlFor="contactInfo.email" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                <Input
                                    id="contactInfo.email"
                                    {...register("contactInfo.email")}
                                    type="email"
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="jordan@stripe.com"
                                />
                                {errors.contactInfo?.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1 mt-1">{errors.contactInfo.email.message}</p>}
                            </div>
                            <div className="gap-y-">
                                <label htmlFor="contactInfo.mobile" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Mobile Number</label>
                                <Input
                                    id="contactInfo.mobile"
                                    {...register("contactInfo.mobile")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="+1 555-0123"
                                />
                            </div>
                            <div className="gap-y-">
                                <label htmlFor="industry" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Professional Role</label>
                                <Input
                                    id="industry"
                                    {...register("industry")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="Software Engineer"
                                />
                            </div>
                            <div className="gap-y-">
                                <label htmlFor="contactInfo.location" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Location</label>
                                <Input
                                    id="contactInfo.location"
                                    {...register("contactInfo.location")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="New York, NY"
                                />
                            </div>
                            <div className="gap-y-">
                                <label htmlFor="contactInfo.linkedin" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">LinkedIn Profile</label>
                                <Input
                                    id="contactInfo.linkedin"
                                    {...register("contactInfo.linkedin")}
                                    className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-12 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium transition-all"
                                    placeholder="linkedin.com/in/jordansmith"
                                />
                            </div>
                            <div className="gap-y-">
                                <label htmlFor="contactInfo.twitter" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Twitter / X Profile</label>
                                <Input
                                    id="contactInfo.twitter"
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
                    <div className="gap-y-">
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
