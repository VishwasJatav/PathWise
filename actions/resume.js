"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIResponse, generateAIJSON } from "@/lib/ai/provider";
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
    return { error: "Failed to save resume" };
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const validated = improveWithAISchema.parse({ current, type });
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) return { error: "User not found" };

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
    const result = await generateAIResponse(prompt, { userId: user.id, feature: "resume-improve" });
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error.message);
    return { error: "Failed to improve content. Please check your AI API key configuration." };
  }
}

export async function getAtsScore({ content, jobDescription }) {
  const validated = getAtsScoreSchema.parse({ content, jobDescription });
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

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
    const parsed = await generateAIJSON(prompt, { userId: user.id, feature: "resume-ats" });

    // Normalize casing so UI never breaks
    return {
      ...parsed,
      demandLevel: parsed.demandLevel?.toUpperCase() || "MEDIUM",
      marketOutlook: parsed.marketOutlook?.toUpperCase() || "NEUTRAL",
    };
  } catch (error) {
    console.error("Failed to parse AI insights:", error.message);
    return { error: "AI response parsing failed. Please try again later." };
  }
}

export async function generateFullResumeWithAI(currentData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) return { error: "User not found" };

  const prompt = `
    You are an expert ATS-optimized resume writer and career coach.
    Take the following partially filled or existing resume data for a professional in the ${user.industry} industry, and write a complete, highly professional, ATS-optimized resume.
    
    Current Data:
    ${JSON.stringify(currentData, null, 2)}
    
    If the current data is empty, invent a highly professional generic profile for a ${user.industry} professional.
    Flesh out the summary to be impactful, enhance the experience bullet points with metrics, and refine the skills section.
    
    Output strictly valid JSON matching exactly this schema:
    {
      "contactInfo": {
        "email": "string",
        "mobile": "string",
        "linkedin": "string",
        "twitter": "string"
      },
      "summary": "string",
      "skills": "comma separated string",
      "experience": [
        {
          "title": "string",
          "company": "string",
          "startDate": "string",
          "endDate": "string",
          "description": "string"
        }
      ],
      "education": [
        {
          "degree": "string",
          "school": "string",
          "startDate": "string",
          "endDate": "string",
          "description": "string"
        }
      ],
      "projects": [
        {
          "title": "string",
          "description": "string",
          "link": "string"
        }
      ]
    }
  `;

  try {
    const aiResume = await generateAIJSON(prompt, { userId: user.id, feature: "resume-generate-full" });
    return { success: true, data: aiResume };
  } catch (error) {
    console.error("Failed to generate full AI resume:", error);
    return { error: "Failed to generate resume with AI." };
  }
}