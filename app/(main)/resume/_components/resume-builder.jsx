"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume, getAtsScore } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";

export default function ResumeBuilder({ initialContent }) {
  const [activeStep, setActiveStep] = useState(1);
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [atsScore, setAtsScore] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const {
    loading: isScoring,
    fn: checkAtsScoreFn,
    data: atsResult,
    error: atsError,
  } = useFetch(getAtsScore);

  const formValues = watch();

  useEffect(() => {
    const newContent = getCombinedContent();
    if (newContent) setPreviewContent(newContent);
  }, [formValues]);

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  useEffect(() => {
    if (atsResult && !isScoring) {
      setAtsScore(atsResult);
      toast.success("ATS Score generated!");
    }
    if (atsError) {
      toast.error(atsError.message || "Failed to generate ATS score");
    }
  }, [atsResult, atsError, isScoring]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo?.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo?.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo?.linkedin) parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo?.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.fullName || "Your Name"}</div>\n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ].filter(Boolean).join("\n\n");
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async () => {
    try {
      const formattedContent = previewContent.replace(/\n/g, "\n").replace(/\n\s*\n/g, "\n\n").trim();
      await saveResumeFn(formattedContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleGetAtsScore = async () => {
    await checkAtsScoreFn({ content: previewContent });
  };

  const steps = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Education" },
    { id: 3, title: "Skills" },
    { id: 4, title: "Experience" },
    { id: 5, title: "Projects" },
  ];

  return (
    <div data-color-mode="light" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="font-bold gradient-title text-4xl md:text-5xl">Resume Builder</h1>
        <div className="space-x-2 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={handleGetAtsScore} disabled={isScoring || !previewContent}>
            {isScoring ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
            Get ATS Score
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />} PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: WIZARD */}
        <div className="flex-1 space-y-6">
          {/* Step Indicator */}
          <div className="flex justify-between items-center border-b pb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-colors ${activeStep === step.id ? "text-primary" : "text-muted-foreground"
                  }`}
                onClick={() => setActiveStep(step.id)}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${activeStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                >
                  {step.id}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Form Wizard */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-xl bg-card">
            {activeStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-left">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input {...register("contactInfo.email")} type="email" placeholder="your@email.com" />
                      {errors.contactInfo?.email && <p className="text-sm text-destructive">{errors.contactInfo.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mobile Number</label>
                      <Input {...register("contactInfo.mobile")} type="tel" placeholder="+1 234 567 8900" />
                      {errors.contactInfo?.mobile && <p className="text-sm text-destructive">{errors.contactInfo.mobile.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">LinkedIn URL</label>
                      <Input {...register("contactInfo.linkedin")} type="url" placeholder="https://linkedin.com/..." />
                      {errors.contactInfo?.linkedin && <p className="text-sm text-destructive">{errors.contactInfo.linkedin.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Twitter/X Profile</label>
                      <Input {...register("contactInfo.twitter")} type="url" placeholder="https://twitter.com/..." />
                      {errors.contactInfo?.twitter && <p className="text-sm text-destructive">{errors.contactInfo.twitter.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Professional Summary</h3>
                  <Controller name="summary" control={control} render={({ field }) => (
                    <Textarea {...field} className="h-32" placeholder="Write a compelling professional summary..." />
                  )} />
                  {errors.summary && <p className="text-sm text-destructive">{errors.summary.message}</p>}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                <h3 className="text-lg font-medium">Education</h3>
                <Controller name="education" control={control} render={({ field }) => (
                  <EntryForm type="Education" entries={field.value} onChange={field.onChange} />
                )} />
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                <h3 className="text-lg font-medium">Skills</h3>
                <Controller name="skills" control={control} render={({ field }) => (
                  <Textarea {...field} className="h-32" placeholder="List your key skills..." />
                )} />
                {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                <h3 className="text-lg font-medium">Work Experience</h3>
                <Controller name="experience" control={control} render={({ field }) => (
                  <EntryForm type="Experience" entries={field.value} onChange={field.onChange} />
                )} />
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                <h3 className="text-lg font-medium">Projects</h3>
                <Controller name="projects" control={control} render={({ field }) => (
                  <EntryForm type="Project" entries={field.value} onChange={field.onChange} />
                )} />
              </div>
            )}

            <div className="flex justify-between pt-4 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => setActiveStep(prev => Math.max(1, prev - 1))} disabled={activeStep === 1}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              {activeStep < 5 ? (
                <Button type="button" onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Resume
                </Button>
              )}
            </div>
          </form>

          {atsScore && (
            <div className="p-4 border border-primary/20 rounded-xl bg-primary/5 mt-6 animate-in slide-in-from-bottom">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                ATS Compatibility: <span className={`ml-2 ${atsScore.score > 80 ? "text-green-500" : "text-yellow-600"}`}>{atsScore.score}/100</span>
              </h3>
              <p className="text-sm text-muted-foreground">{atsScore.feedback}</p>
              {atsScore.missingKeywords?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Suggested Keywords:</h4>
                  <div className="flex flex-wrap gap-2">
                    {atsScore.missingKeywords.map(kw => (
                      <span key={kw} className="px-2 py-1 bg-background border text-foreground text-xs rounded-md">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="flex-1 border rounded-xl overflow-hidden bg-card flex flex-col h-fit sticky top-20 shadow-sm">
          <div className="bg-muted p-3 flex justify-between items-center border-b">
            <h3 className="font-semibold text-sm">Live Preview</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
            >
              {resumeMode === "preview" ? (
                <><Edit className="h-3 w-3 mr-1" /> Edit Markdown</>
              ) : (
                <><Monitor className="h-3 w-3 mr-1" /> View Preview</>
              )}
            </Button>
          </div>
          <div className="p-4 overflow-y-auto min-h-[500px] max-h-[800px]">
            {resumeMode !== "preview" && (
              <div className="flex p-3 gap-2 items-center border border-yellow-600/50 text-yellow-600 rounded-md bg-yellow-50/10 mb-4">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">Warning: Any changes made directly to markdown will be overwritten if you edit the form on the left.</span>
              </div>
            )}
            <MDEditor value={previewContent} onChange={setPreviewContent} height={600} preview={resumeMode} className="!border-0 shadow-none !bg-transparent" />
          </div>

          {/* Hidden PDF container */}
          <div className="hidden">
            <div id="resume-pdf" className="p-8 bg-white text-black min-h-[1056px] w-[794px]">
              <MDEditor.Markdown source={previewContent} style={{ background: "white", color: "black", width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
