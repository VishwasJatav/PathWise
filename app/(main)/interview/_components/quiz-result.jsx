"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { m } from "framer-motion";

export default function QuizResult({ result, hideStartNew = false, onStartNew }) {
  if (!result) return null;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto space-y-6"
    >
      {/* Title */}
      <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
        <Trophy className="size-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
        Quiz Results
      </h1>

      <CardContent className="space-y-8 px-0">
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <h3 className="text-4xl font-black text-white drop-shadow-md">{result.quizScore.toFixed(1)}%</h3>
          <Progress 
            value={result.quizScore} 
            className="w-full h-3 rounded-full bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500" 
          />
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-indigo-900/20 p-5 rounded-xl border border-indigo-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.05)]"
          >
            <p className="font-bold text-indigo-300 uppercase tracking-wider text-xs mb-2">Improvement Tip</p>
            <p className="text-gray-200 leading-relaxed">{result.improvementTip}</p>
          </m.div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-200 text-lg border-b border-gray-800 pb-2">Question Review</h3>
          {result.questions.map((q, index) => (
            <m.div
              key={q.question}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="border border-gray-800/60 rounded-xl p-5 space-y-3 bg-gray-900/40 backdrop-blur-md transition-colors hover:bg-gray-800/40"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium text-white leading-relaxed">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="size-6 text-green-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
                ) : (
                  <XCircle className="size-6 text-red-500 flex-shrink-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                )}
              </div>
              <div className="text-sm text-gray-300 space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                <p><span className="text-gray-500">Your answer:</span> <span className={q.isCorrect ? "text-green-400" : "text-red-400"}>{q.userAnswer}</span></p>
                {!q.isCorrect && <p><span className="text-gray-500">Correct answer:</span> <span className="text-green-400">{q.answer}</span></p>}
              </div>
              <div className="text-sm bg-blue-950/20 p-3 rounded-lg border border-blue-900/30">
                <p className="font-bold text-blue-400 uppercase text-[10px] tracking-wider mb-1">Explanation</p>
                <p className="text-gray-300 leading-relaxed">{q.explanation}</p>
              </div>
            </m.div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="px-0">
          <Button type="button"
            onClick={onStartNew}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
          >
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </m.div>
  );
}
