"use server";

import { generateAIJSON } from "@/lib/ai/provider";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { PDFParse } from "pdf-parse";

export async function importResumeFromPDF(formData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return { error: "User not found" };

  const file = formData.get("file");
  if (!file || file.type !== "application/pdf") {
    return { error: "Please upload a valid PDF file" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text from PDF
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    const rawText = textResult.text;

    if (!rawText || rawText.trim().length === 0) {
      return { error: "Could not extract text from the PDF" };
    }

    const prompt = `
      You are an expert resume parser. I will provide raw text extracted from a PDF resume.
      Your task is to parse this text and structure it into a specific JSON schema.
      
      Extract as much detail as possible. Ensure the output strictly follows this JSON format:
      {
        "contactInfo": {
          "email": "string or empty",
          "mobile": "string or empty",
          "linkedin": "string or empty",
          "twitter": "string or empty"
        },
        "summary": "string summarizing the professional profile",
        "skills": "comma separated string of skills",
        "experience": [
          {
            "title": "string",
            "company": "string",
            "startDate": "YYYY-MM (if available)",
            "endDate": "YYYY-MM or Current",
            "description": "string describing achievements and responsibilities"
          }
        ],
        "education": [
          {
            "degree": "string",
            "school": "string",
            "startDate": "YYYY (if available)",
            "endDate": "YYYY (if available)",
            "description": "string or empty"
          }
        ],
        "projects": [
          {
            "title": "string",
            "description": "string describing the project",
            "link": "string or empty"
          }
        ]
      }
      
      Here is the raw resume text:
      ${rawText}
    `;

    const parsedResumeData = await generateAIJSON(prompt, { userId: user.id, feature: "resume-import" });
    
    return { success: true, data: parsedResumeData };
  } catch (error) {
    console.error("Error importing resume:", error);
    return { error: "Failed to parse PDF resume." };
  }
}
