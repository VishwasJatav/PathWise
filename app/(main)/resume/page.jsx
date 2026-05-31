import { getResume } from '@/actions/resume'
import React from 'react'
import ResumeBuilder from './_components/resume-builder-v2';


export const metadata = {
  title: 'AI Resume Builder | Rixora',
  description: 'Create ATS-optimized resumes with AI assistance. Choose from premium templates and generate content instantly.',
};

const ResumePage = async () => {
  const resume = await getResume();

  let initialData = null;
  if (resume?.content) {
    try {
      initialData = JSON.parse(resume.content);
    } catch (e) {
      // Fallback for legacy markdown content or empty content
      console.log("Legacy resume content detected, starting fresh or parsing markdown...");
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden animate-fade-in">
      <ResumeBuilder initialData={initialData} />
    </div>
  );
};

export default ResumePage;

