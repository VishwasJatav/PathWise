"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getAssessments } from "@/actions/interview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";
import { m } from "framer-motion";

export default function QuizList({ initialAssessments = [], initialNextCursor = null }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [assessments, setAssessments] = useState(initialAssessments);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (!nextCursor) return;
    setIsLoading(true);
    try {
      const result = await getAssessments(nextCursor, 5);
      setAssessments((prev) => [...prev, ...result.assessments]);
      setNextCursor(result.nextCursor);
    } catch (error) {
      console.error("Failed to load more assessments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="border-white/5 bg-background/50 backdrop-blur-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="gradient-title text-3xl md:text-4xl">
                  Recent Quizzes
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Review your past quiz performance
                </CardDescription>
              </div>
              <Button type="button" onClick={() => router.push("/interview/mock")}>
                Start New Quiz
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <m.div 
              className="space-y-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {assessments?.map((assessment, i) => (
                <m.div key={assessment.id} variants={itemVariants}>
                  <Card
                    className="cursor-pointer border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:-translate-y-1"
                    onClick={() => setSelectedQuiz(assessment)}
                  >
                    <CardHeader>
                      <CardTitle className="gradient-title text-2xl">
                        Quiz {i + 1}
                      </CardTitle>
                      <CardDescription className="flex justify-between w-full text-slate-400">
                        <div>Score: <span className="font-bold text-white">{assessment.quizScore.toFixed(1)}%</span></div>
                        <div>
                          {format(
                            new Date(assessment.createdAt),
                            "MMMM dd, yyyy HH:mm"
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    {assessment.improvementTip && (
                      <CardContent>
                        <p className="text-sm text-slate-300">
                          {assessment.improvementTip}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </m.div>
              ))}
            </m.div>

            {nextCursor && (
              <div className="flex justify-center mt-6 pt-4 border-t border-white/10">
                <Button type="button" onClick={loadMore} disabled={isLoading} variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5">
                  {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Load More Quizzes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </m.div>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-2xl border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Quiz Result</DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}