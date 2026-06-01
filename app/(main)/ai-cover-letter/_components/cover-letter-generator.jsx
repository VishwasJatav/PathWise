"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";

export default function CoverLetterGenerator() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  // Navigate when letter is generated
  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated successfully!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter]);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn(data);
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  return (
    <AnimatePresence>
      <m.div
        key="cover-letter-generator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="border-white/10 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-3xl text-white">Job Details</CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Provide information about the position you're applying for
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <m.div whileFocus={{ scale: 1.01 }} className="space-y-2 relative group">
                  <Label htmlFor="companyName" className="text-slate-300">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    className="bg-slate-900/50 border-white/10 text-white focus:border-blue-500 transition-colors"
                    {...register("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500 absolute -bottom-5">
                      {errors.companyName.message}
                    </p>
                  )}
                </m.div>

                <m.div whileFocus={{ scale: 1.01 }} className="space-y-2 relative group">
                  <Label htmlFor="jobTitle" className="text-slate-300">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="Enter job title"
                    className="bg-slate-900/50 border-white/10 text-white focus:border-blue-500 transition-colors"
                    {...register("jobTitle")}
                  />
                  {errors.jobTitle && (
                    <p className="text-sm text-red-500 absolute -bottom-5">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </m.div>
              </div>

              <m.div whileFocus={{ scale: 1.01 }} className="space-y-2 relative group pt-2">
                <Label htmlFor="jobDescription" className="text-slate-300">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here"
                  className="h-40 bg-slate-900/50 border-white/10 text-white focus:border-blue-500 transition-colors resize-none"
                  {...register("jobDescription")}
                />
                {errors.jobDescription && (
                  <p className="text-sm text-red-500 absolute -bottom-5">
                    {errors.jobDescription.message}
                  </p>
                )}
              </m.div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={generating}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all font-semibold"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Generating Cover Letter...
                    </>
                  ) : (
                    "Generate Cover Letter"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </m.div>
    </AnimatePresence>
  );
}
