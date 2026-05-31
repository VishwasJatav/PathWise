"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIResponse, generateAIJSON } from "@/lib/ai/provider";
import { redis } from "@/lib/redis";

export const generateAIInsights = async (industry, userId = null) => {
  const { userId: authUserId } = await auth();
  if (!authUserId) throw new Error("Unauthorized");
  if (!industry) throw new Error("Industry is required for insights");

  const prompt = `
    Analyze the current state and futuristic trends of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "HIGH" | "MEDIUM" | "LOW",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"],
    "nextDecadeOutlook": "string",
    "emergingTechnologies": ["tech1", "tech2"]
  }

  CRITICAL INSTRUCTION: Return ONLY valid JSON.
  Do not include explanations, markdown, or text outside the JSON object.

  Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
    The nextDecadeOutlook should be a high-level overview of where the industry is heading in the next 10 years including futuristic skill roadmaps.
  `;

  try {
    const parsed = await generateAIJSON(prompt, { userId, feature: "industry-insights" });

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
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // --- FIX 1: Handle users without a set industry ---
  // If the user hasn't set their industry, we can't generate insights.
  if (!user.industry) {
    console.log("User has not set an industry. Cannot generate insights.");
    return null;
  }

  // --- FIX: Check Redis cache first ---
  const cacheKey = `industry_insight:${user.industry}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for industry: ${user.industry}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error("Redis cache error:", err); // Fail gracefully
  }

  // If not in Redis, check database
  if (user.industryInsight) {
    // Populate Redis asynchronously for next time
    redis.set(cacheKey, JSON.stringify(user.industryInsight), "EX", 3600).catch(console.error);

    // Stale-While-Revalidate: Trigger background insights update if stale (nextUpdate is in the past)
    const isStale = new Date() > new Date(user.industryInsight.nextUpdate);
    if (isStale) {
      console.log(`[Cache] Industry insights for "${user.industry}" are stale. Spawning background refresh...`);
      (async () => {
        try {
          const freshInsights = await generateAIInsights(user.industry, user.id);
          if (freshInsights && !freshInsights.error) {
            const formattedInsights = {
              ...freshInsights,
              demandLevel: freshInsights.demandLevel.toUpperCase(),
              marketOutlook: freshInsights.marketOutlook.toUpperCase(),
            };
            const updatedInsight = await db.industryInsight.update({
              where: { industry: user.industry },
              data: {
                ...formattedInsights,
                lastUpdated: new Date(),
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
              },
            });
            // Update Redis cache with fresh data
            await redis.set(cacheKey, JSON.stringify(updatedInsight), "EX", 3600);
            console.log(`[Cache] Successfully updated stale insights for "${user.industry}" in background.`);
          }
        } catch (err) {
          console.error(`[Cache] Failed to refresh stale insights for "${user.industry}":`, err.message);
        }
      })();
    }

    return user.industryInsight;
  }

  // --- If no insights exist, generate them ---
  // We now know for sure that user.industry has a value.
  const insights = await generateAIInsights(user.industry, user.id);

  // Prisma needs the enum types in uppercase, so we ensure that here.
  const formattedInsights = {
    ...insights,
    demandLevel: insights.demandLevel.toUpperCase(),
    marketOutlook: insights.marketOutlook.toUpperCase(),
  };

  const industryInsight = await db.industryInsight.create({
    data: {
      industry: user.industry,
      ...formattedInsights,
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
    },
  });

  // --- FIX 2: Connect the new insight back to the user ---
  // This was missing and is crucial for the check `if (user.industryInsight)` 
  // to work on the next page load.
  await db.user.update({
    where: { id: user.id },
    data: {
      industryInsight: {
        connect: { industry: user.industry }
      }
    }
  });

  // Save to Redis cache
  try {
    await redis.set(cacheKey, JSON.stringify(industryInsight), "EX", 3600);
  } catch (err) {
    console.error("Failed to save to Redis:", err);
  }

  return industryInsight;
}