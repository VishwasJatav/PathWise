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
import { motion } from "framer-motion";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

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
        <BarLoader width="100%" color="#9ca3af" />
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
      <Card className="mx-2 shadow-lg border-gray-700">
        <CardHeader className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-400" />
          <CardTitle className="text-white">Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            This quiz contains 10 questions tailored to your industry and skills.
            Choose the best answer for each question and learn as you go!
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateQuizFn}
            className="w-full bg-gray-700/40 backdrop-blur-md border border-gray-500 text-gray-200 hover:bg-gray-700/60 transition"
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-2"
    >
      <Card className="shadow-lg border-gray-700">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-white">
            Question {currentQuestion + 1} of {quizData.length}
          </CardTitle>
          <span className="text-gray-400">
            {currentQuestion + 1}/{quizData.length}
          </span>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-lg font-semibold text-white">{question.question}</p>

          <RadioGroup
            onValueChange={handleAnswer}
            value={answers[currentQuestion]}
            className="space-y-3"
          >
            {question.options.map((option, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition"
              >
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="text-gray-200">
                  {option}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-gray-800/60 rounded-lg border border-gray-600 backdrop-blur-md"
            >
              <p className="font-semibold text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" /> Explanation:
              </p>
              <p className="text-gray-300">{question.explanation}</p>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between gap-2">
          {!showExplanation && (
            <Button
              onClick={() => setShowExplanation(true)}
              variant="outline"
              disabled={!answers[currentQuestion]}
              className="text-gray-200 border-gray-500 hover:bg-gray-700/40 backdrop-blur-md transition"
            >
              Show Explanation
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion] || savingResult}
            className="ml-auto bg-gray-700/40 backdrop-blur-md border border-gray-500 text-gray-200 hover:bg-gray-700/60 flex items-center gap-2 transition"
          >
            {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
