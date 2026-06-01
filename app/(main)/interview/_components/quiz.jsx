"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { m } from "framer-motion";
import { CheckCircle, XCircle, BookOpen, Timer, Trophy } from "lucide-react";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) setAnswers(new Array(quizData.length).fill(null));
  }, [quizData]);

  // Timer reset per question
  useEffect(() => {
    setTimeLeft(60);
  }, [currentQuestion]);

  // Timer countdown logic
  useEffect(() => {
    if (showExplanation || !quizData || generatingQuiz || savingResult || resultData) return;

    if (timeLeft <= 0) {
      if (!answers[currentQuestion]) {
        // Auto-fail the question if no answer selected
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = "Time Expired";
        setAnswers(newAnswers);
      }
      setShowExplanation(true);
      return;
    }

    const timerObj = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerObj);
  }, [timeLeft, showExplanation, quizData, currentQuestion, generatingQuiz, savingResult, resultData, answers]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else finishQuiz();
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, idx) => {
      if (answer === quizData[idx].correctAnswer) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return (
      <div className="flex justify-center mt-10">
        <BarLoader width="100%" color="#3b82f6" />
      </div>
    );
  }

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2 shadow-xl border-white/10 bg-background/50 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <BookOpen className="size-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <CardTitle className="text-white text-2xl">Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 leading-relaxed">
            This quiz contains 10 questions tailored to your industry and skills.
            Choose the best answer for each question and learn as you go!
          </p>
        </CardContent>
        <CardFooter>
          <Button type="button"
            onClick={generateQuizFn}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-2"
    >
      <Card className="shadow-2xl border-white/10 bg-background/50 backdrop-blur-xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
          <div>
            <CardTitle className="text-white text-2xl">
              Question {currentQuestion + 1} <span className="text-slate-500 text-lg font-normal">of {quizData.length}</span>
            </CardTitle>
            <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1.5 font-medium tracking-wide uppercase">
              <Trophy className="size-3.5" /> Adaptive Difficulty
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-inner ${timeLeft <= 10 ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
            <Timer className="size-4" />
            <span className="font-mono font-bold text-lg">{timeLeft}s</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <p className="text-xl font-medium text-white leading-relaxed">{question.question}</p>

          <RadioGroup
            onValueChange={handleAnswer}
            value={answers[currentQuestion]}
            className="space-y-3"
          >
            {question.options.map((option, idx) => (
              <m.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-colors shadow-sm"
              >
                <RadioGroupItem value={option} id={`option-${idx}`} className="border-slate-500 text-blue-500" />
                <Label htmlFor={`option-${idx}`} className="text-slate-200 text-base font-normal cursor-pointer flex-1">
                  {option}
                </Label>
              </m.div>
            ))}
          </RadioGroup>

          {showExplanation && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-5 bg-indigo-900/20 rounded-xl border border-indigo-500/30 backdrop-blur-md shadow-inner overflow-hidden"
            >
              <p className="font-bold text-indigo-300 flex items-center gap-2 mb-2 uppercase tracking-wide text-sm">
                <CheckCircle className="size-4 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" /> Explanation
              </p>
              <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
            </m.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between gap-4 pt-4 border-t border-white/5">
          {!showExplanation && (
            <Button type="button"
              onClick={() => setShowExplanation(true)}
              variant="outline"
              disabled={!answers[currentQuestion]}
              className="text-slate-300 border-slate-600 hover:bg-slate-800 hover:text-white transition-all"
            >
              Show Explanation
            </Button>
          )}
          <Button type="button"
            onClick={handleNext}
            disabled={!answers[currentQuestion] || savingResult}
            className="ml-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] px-8"
          >
            {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </m.div>
  );
}
