"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIResponse } from "@/lib/ai/provider";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const saveResumeSchema = z.object({
  content: z.string().min(1, "Resume content is required"),
});

const improveWithAISchema = z.object({
  current: z.string().min(1, "Current content is required"),
  type: z.string().min(1, "Optimization type is required"),
});

const getAtsScoreSchema = z.object({
  content: z.string().min(1, "Resume content is required"),
  jobDescription: z.string().optional(),
});

export async function saveResume(content) {
  // If content is an object, stringify it
  const stringContent = typeof content === "object" ? JSON.stringify(content) : content;

  const validated = saveResumeSchema.parse({ content: stringContent });
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content: validated.content,
      },
      create: {
        userId: user.id,
        content: validated.content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const validated = improveWithAISchema.parse({ current, type });
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${validated.type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${validated.current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await generateAIResponse(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}

export async function getAtsScore({ content, jobDescription }) {
  const validated = getAtsScoreSchema.parse({ content, jobDescription });
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
    Analyze this resume for ATS (Applicant Tracking System) compatibility${validated.jobDescription ? ` against this job description:\n${validated.jobDescription}` : ""
    }.
    
    Resume Content:
    ${validated.content}
    
    Provide ONLY a JSON response in this exact format:
    {
      "score": 85,
      "feedback": "string explaining strengths and weaknesses (max 3 sentences)",
      "missingKeywords": ["keyword1", "keyword2"]
    }
  `;

  try {
    const result = await generateAIResponse(prompt);
    const text = await result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error analyzing ATS score:", error);
    throw new Error("Failed to calculate ATS score");
  }
}