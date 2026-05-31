"use client";

import React from "react";
import { useResume } from "./resume-provider";
import { cn } from "@/lib/utils";

const ClassicTemplate = ({ data }) => {
    return (
        <div className="p-8 bg-white text-black min-h-screen font-serif">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wider">{data.contactInfo?.name || "Your Name"}</h1>
                <div className="flex justify-center gap-3 text-sm mt-1 flex-wrap">
                    {data.contactInfo?.email && <span>{data.contactInfo.email}</span>}
                    {data.contactInfo?.mobile && <span>• {data.contactInfo.mobile}</span>}
                    {data.contactInfo?.linkedin && <span>• [LinkedIn]</span>}
                    {data.contactInfo?.twitter && <span>• [Twitter]</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Professional Summary</h2>
                    <p className="text-sm leading-relaxed">{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Work Experience</h2>
                    <div className="gap-y-">
                        {data.experience.map((exp, index) => (
                            <div key={exp.title}>
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{exp.title} | {exp.organization}</span>
                                    <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <div className="text-sm mt-1 whitespace-pre-line prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 prose-li:my-0"
                                    dangerouslySetInnerHTML={{ __html: exp.description }} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Skills</h2>
                    <p className="text-sm">{data.skills}</p>
                </section>
            )}

            {/* Education */}
            {data.education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Education</h2>
                    <div className="gap-y-">
                        {data.education.map((edu, index) => (
                            <div key={edu.degree}>
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{edu.degree} | {edu.organization}</span>
                                    <span>{edu.startDate} - {edu.endDate}</span>
                                </div>
                                {edu.description && <p className="text-sm mt-1 italic">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

const ModernTemplate = ({ data }) => {
    return (
        <div className="p-10 bg-white text-slate-800 min-h-screen font-sans">
            <div className="flex justify-between items-start border-b-4 border-slate-800 pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{data.contactInfo?.name || "Your Name"}</h1>
                    <p className="text-lg text-slate-600 font-medium mt-1">{data.industry || "Professional Title"}</p>
                </div>
                <div className="text-right text-sm gap-y-">
                    {data.contactInfo?.email && <p className="flex items-center justify-end gap-2">{data.contactInfo.email}</p>}
                    {data.contactInfo?.mobile && <p>{data.contactInfo.mobile}</p>}
                    <div className="flex gap-3 justify-end mt-2">
                        {data.contactInfo?.linkedin && <span className="text-blue-600 font-bold">LinkedIn</span>}
                        {data.contactInfo?.twitter && <span className="text-sky-500 font-bold">Twitter</span>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-10">
                <div className="col-span-2 gap-y-">
                    {data.summary && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-slate-800 pl-3 mb-3 uppercase tracking-wider">Experience</h2>
                            <div className="gap-y-">
                                {data.experience?.map((exp, i) => (
                                    <div key={exp.title} className="relative pl-2">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-slate-900">{exp.title}</h3>
                                            <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">
                                                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700 mb-2">{exp.organization}</p>
                                        <div className="text-sm text-slate-600 whitespace-pre-line"
                                            dangerouslySetInnerHTML={{ __html: exp.description }} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects?.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-slate-800 pl-3 mb-3 uppercase tracking-wider">Projects</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {data.projects.map((proj, i) => (
                                    <div key={proj.title} className="border border-slate-100 p-3 rounded-lg bg-slate-50/50">
                                        <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                                        <p className="text-xs text-slate-600 mb-2">{proj.organization}</p>
                                        <p className="text-xs text-slate-600 italic leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="gap-y-">
                    <section>
                        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">Summary</h2>
                        <p className="text-xs leading-relaxed text-slate-600 uppercase font-medium mb-1 tracking-tighter">Profile</p>
                        <p className="text-sm leading-relaxed text-slate-700">{data.summary}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills?.split(",").map((s, i) => (
                                <span key={s.trim()} className="bg-slate-800 text-white px-2 py-1 text-[10px] font-bold rounded uppercase tracking-widest">{s.trim()}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">Education</h2>
                        <div className="gap-y-">
                            {data.education?.map((edu, i) => (
                                <div key={edu.degree}>
                                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{edu.organization}</h3>
                                    <p className="text-xs text-slate-600 font-medium">{edu.degree}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const MinimalTemplate = ({ data }) => {
    return (
        <div className="p-12 bg-white text-black min-h-screen font-sans border-[12px] border-gray-50">
            <div className="mb-10">
                <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">{data.contactInfo?.name || "Your Name"}</h1>
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {data.contactInfo?.email && <span>{data.contactInfo.email}</span>}
                    {data.contactInfo?.mobile && <span>/ {data.contactInfo.mobile}</span>}
                    {data.contactInfo?.linkedin && <span>/ LinkedIn</span>}
                </div>
            </div>

            <div className="gap-y-">
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-gray-400">About</h2>
                    <p className="text-sm leading-relaxed max-w-2xl">{data.summary}</p>
                </section>

                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Experience</h2>
                    <div className="gap-y-">
                        {data.experience?.map((exp, i) => (
                            <div key={exp.title}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-black uppercase tracking-tight">{exp.title}</h3>
                                    <span className="text-[10px] font-bold text-gray-400">{exp.startDate} — {exp.current ? "NOW" : exp.endDate}</span>
                                </div>
                                <p className="text-xs font-bold text-gray-500 mb-2 uppercase">{exp.organization}</p>
                                <div className="text-xs leading-relaxed text-gray-700 whitespace-pre-line"
                                    dangerouslySetInnerHTML={{ __html: exp.description }} />
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-10">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Education</h2>
                        <div className="gap-y-">
                            {data.education?.map((edu, i) => (
                                <div key={edu.degree}>
                                    <h3 className="text-xs font-black uppercase">{edu.organization}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold mt-1">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Expertise</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {data.skills?.split(",").map((s, i) => (
                                <span key={s.trim()} className="text-[10px] font-black uppercase tracking-wider">{s.trim()}</span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const CreativeTemplate = ({ data }) => {
    return (
        <div className="p-0 bg-white text-gray-800 min-h-screen font-sans flex flex-col">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-500 flex items-center px-12 shrink-0">
                <div className="text-white">
                    <h1 className="text-4xl font-bold tracking-tight">{data.contactInfo?.name || "Your Name"}</h1>
                    <p className="text-purple-100 font-medium">{data.industry || "Creative Professional"}</p>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 bg-gray-50 p-8 gap-y- border-r border-gray-100 uppercase tracking-wider text-[10px] font-bold text-gray-400">
                    <section>
                        <h2 className="text-purple-600 mb-4 border-b pb-1">Contact</h2>
                        <div className="gap-y- text-gray-600 normal-case font-medium text-xs tracking-normal">
                            {data.contactInfo?.email && <p className="break-all">{data.contactInfo.email}</p>}
                            {data.contactInfo?.mobile && <p>{data.contactInfo.mobile}</p>}
                            {data.contactInfo?.linkedin && <p className="text-blue-500 underline">LinkedIn</p>}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-purple-600 mb-4 border-b pb-1">Skills</h2>
                        <div className="flex flex-wrap gap-2 normal-case tracking-normal">
                            {data.skills?.split(",").map((s, i) => (
                                <span key={s.trim()} className="bg-white border px-2 py-1 rounded text-xs text-gray-700">{s.trim()}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-purple-600 mb-4 border-b pb-1">Education</h2>
                        <div className="gap-y- normal-case tracking-normal">
                            {data.education?.map((edu, i) => (
                                <div key={edu.degree}>
                                    <p className="text-xs font-bold text-gray-800">{edu.organization}</p>
                                    <p className="text-[10px] text-gray-500">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 gap-y-">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="size- rounded-full bg-purple-600" />
                            Profile
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-600 italic">"{data.summary}"</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="size- rounded-full bg-blue-500" />
                            Experience
                        </h2>
                        <div className="gap-y- border-l-2 border-gray-100 ml-1 pl-6">
                            {data.experience?.map((exp, i) => (
                                <div key={exp.title} className="relative">
                                    <div className="absolute left-[-31px] top-[6px] size- rounded-full bg-white border-2 border-purple-600" />
                                    <h3 className="font-bold text-gray-900 text-sm">{exp.title}</h3>
                                    <div className="flex justify-between items-center text-xs text-purple-600 font-bold mb-2">
                                        <span>{exp.organization}</span>
                                        <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line"
                                        dangerouslySetInnerHTML={{ __html: exp.description }} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export const ResumePreview = ({ isModal = false }) => {
    const { debouncedResumeData, template, zoom } = useResume();
    const containerRef = React.useRef(null);
    const [scale, setScale] = React.useState(1);

    React.useEffect(() => {
        if (!containerRef.current) return;
        
        const updateScale = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.getBoundingClientRect().width;
            
            const a4Width = 794;
            const padding = 16;
            const availableWidth = containerWidth - padding;
            
            let calculatedScale = availableWidth / a4Width;
            if (isModal) {
                calculatedScale = Math.min(calculatedScale, 1.1);
            } else {
                calculatedScale = calculatedScale * (zoom / 100);
            }
            setScale(calculatedScale);
        };

        // eslint-disable-next-line react-doctor/no-adjust-state-on-prop-change
        updateScale();
        
        const resizeObserver = new ResizeObserver(() => {
            // eslint-disable-next-line react-doctor/no-adjust-state-on-prop-change
            updateScale();
        });
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [zoom, isModal]);

    return (
        <div ref={containerRef} className="w-full flex justify-center overflow-hidden py-6">
            <div
                id="resume-content"
                className="w-[210mm] min-h-[297mm] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.6)] origin-top transition-all duration-300 ease-out rounded-sm ring-1 ring-black/5 shrink-0"
                style={{
                    transform: `scale(${scale})`,
                    marginBottom: `${(scale - 1) * 1122}px`,
                }}
            >
                {template === "classic" && <ClassicTemplate data={debouncedResumeData} />}
                {template === "modern" && <ModernTemplate data={debouncedResumeData} />}
                {template === "minimal" && <MinimalTemplate data={debouncedResumeData} />}
                {template === "creative" && <CreativeTemplate data={debouncedResumeData} />}

                {!["classic", "modern", "minimal", "creative"].includes(template) && (
                    <div className="p-8 bg-white text-black min-h-[297mm]">
                        Coming Soon…
                    </div>
                )}
            </div>
        </div>
    );
};
