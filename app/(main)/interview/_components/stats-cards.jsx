"use client";

import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { m } from "framer-motion";

export default function StatsCards({ assessments }) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <m.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="dashboard-card-hover border-white/5 bg-background/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Average Score</CardTitle>
            <Trophy className="size-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{getAverageScore()}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all assessments</p>
          </CardContent>
        </Card>
      </m.div>

      <m.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="dashboard-card-hover border-white/5 bg-background/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Questions Practiced</CardTitle>
            <Brain className="size-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{getTotalQuestions()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total questions</p>
          </CardContent>
        </Card>
      </m.div>

      <m.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="dashboard-card-hover border-white/5 bg-background/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Latest Score</CardTitle>
            <Target className="size-5 text-sky-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">
              {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Most recent quiz</p>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}