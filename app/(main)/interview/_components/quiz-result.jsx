"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function QuizResult({ result, hideStartNew = false, onStartNew }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto space-y-6"
    >
      {/* Title */}
      <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
        <Trophy className="h-6 w-6 text-yellow-400" />
        Quiz Results
      </h1>

      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">{result.quizScore.toFixed(1)}%</h3>
          <Progress value={result.quizScore} className="w-full h-3 rounded-full bg-gray-700/50" />
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/60 p-4 rounded-lg border border-gray-600 backdrop-blur-md"
          >
            <p className="font-semibold text-gray-200">Improvement Tip:</p>
            <p className="text-gray-300">{result.improvementTip}</p>
          </motion.div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-200">Question Review</h3>
          {result.questions.map((q, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-700 rounded-lg p-4 space-y-2 bg-gray-900/40 backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-white">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-gray-300">
                <p>Your answer: {q.userAnswer}</p>
                {!q.isCorrect && <p>Correct answer: {q.answer}</p>}
              </div>
              <div className="text-sm bg-gray-800/50 p-2 rounded border border-gray-600">
                <p className="font-medium text-gray-200">Explanation:</p>
                <p className="text-gray-300">{q.explanation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <Button
            onClick={onStartNew}
            className="w-full bg-gray-700/40 backdrop-blur-md border border-gray-600 text-gray-200 hover:bg-gray-700/60 transition"
          >
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </motion.div>
  );
}
