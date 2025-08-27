import { getResume } from '@/actions/resume'
import React from 'react'
import { get } from 'react-hook-form'
import ResumeBuilder from './_components/resume-builder';

const ResumePage = async() => {
const resume = await getResume();

  return<div>
    <ResumeBuilder initialContent={resume?.content}/>
  </div>;
};

export default ResumePage;