"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIResponse, generateAIJSON } from "@/lib/ai/provider";
import { z } from "zod";

const saveQuizResultSchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
    explanation: z.string().optional()
  })),
  answers: z.array(z.string()),
  score: z.number()
});

/** Generate 10 technical interview questions for the authenticated user based on skills and past mistakes */
export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, industry: true, skills: true },
  });
  if (!user) throw new Error("User not found");

  // Fetch past 3 assessments to identify weaknesses
  const recentAssessments = await db.assessment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  let weaknesses = [];
  if (recentAssessments.length > 0) {
    const wrongQuestions = recentAssessments.flatMap((a) =>
      a.questions.filter((q) => !q.isCorrect)
    );
    if (wrongQuestions.length > 0) {
      weaknesses = wrongQuestions.slice(0, 3).map((q) => q.question);
    }
  }

  const prompt = `
    Generate 10 technical interview questions for a ${user.industry} professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    ${weaknesses.length > 0
      ? `The user previously struggled with these topics/questions:\n${weaknesses.join(
        "\n"
      )}\nPlease include 3-4 questions that test these specific areas to help them improve, while keeping the rest a mix of new topics.`
      : ""
    }
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this exact JSON format only:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const quiz = await generateAIJSON(prompt);
    if (!quiz || !quiz.questions) throw new Error("Invalid response format from AI");
    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    return { error: "Failed to generate quiz questions. AI service may be unavailable." };
  }
}

/** Save quiz results and generate improvement tip if necessary */
export async function saveQuizResult(questions, answers, score) {
  const validated = saveQuizResultSchema.parse({ questions, answers, score });
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const questionResults = validated.questions.map((q, i) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: validated.answers[i],
    isCorrect: q.correctAnswer === validated.answers[i],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes.
    `;

    try {
      const tipResult = await generateAIResponse(improvementPrompt);
      improvementTip = tipResult.response.text().trim();
    } catch (error) {
      console.error("Error generating improvement tip:", error);
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: validated.score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

/** Fetch all assessments for the authenticated user */
export async function getAssessments(cursorId = null, limit = 5) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  try {
    const query = {
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }, // Newest first
      take: limit + 1,
    };

    if (cursorId) {
      query.cursor = { id: cursorId };
      query.skip = 1; // Skip the cursor itself
    }

    const assessments = await db.assessment.findMany(query);

    let nextCursor = null;
    if (assessments.length > limit) {
      const nextItem = assessments.pop(); // Remove the extra item
      nextCursor = nextItem.id;
    }

    return { assessments, nextCursor };
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
