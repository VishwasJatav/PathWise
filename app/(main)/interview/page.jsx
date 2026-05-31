import { getAssessments } from "@/actions/interview";

import PerformanceChart from "./_components/performance-chart";
import StatsCards from "./_components/stats-cards";
import QuizList from "./_components/quiz-list";


export const metadata = {
  title: 'Mock Interview Prep | Rixora',
  description: 'Prepare for your interviews with AI-generated questions and feedback.',
};

export default async function InterviewPrepPage() {
  const { assessments, nextCursor } = await getAssessments();

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="gap-y-">
        <div className="animate-fade-in-up stagger-1">
          <StatsCards assessments={assessments} />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <PerformanceChart assessments={assessments} />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <QuizList initialAssessments={assessments} initialNextCursor={nextCursor} />
        </div>
      </div>
    </div>
  );
}

