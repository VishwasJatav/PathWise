"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";
import { z } from "zod";

const updateUserSchema = z.object({
  industry: z.string({ required_error: "Industry is required" }),
  experience: z.number({ required_error: "Experience must be a number" }).min(0, "Experience must be at least 0"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  skills: z.array(z.string()).optional(),
});

export async function updateUser(data) {
  const validatedData = updateUserSchema.parse(data);
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Check for existing insights OUTSIDE the transaction
    let industryInsight = await db.industryInsight.findUnique({
      where: { industry: validatedData.industry },
    });

    // If no existing insight, generate it OUTSIDE the transaction
    if (!industryInsight) {
      const insights = await generateAIInsights(validatedData.industry);

      // We can create it right away too, outside the main transaction, 
      // or inside. Creating it outside ensures the main transaction is just the user update.
      industryInsight = await db.industryInsight.create({
        data: {
          industry: validatedData.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    const result = await db.$transaction(
      async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: validatedData.industry,
            experience: validatedData.experience,
            bio: validatedData.bio,
            skills: validatedData.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      { timeout: 10000 }
    );

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    return { success: false, error: `Failed to update profile: ${error.message}` };
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    // If user record doesn't exist yet (race condition on first sign-up),
    // treat as not onboarded rather than throwing.
    if (!user) return { isOnboarded: false };

    return { isOnboarded: !!user.industry };
  } catch (error) {
    console.error("Error fetching user onboarding status:", error.message);
    throw new Error("Failed to fetch onboarding status: " + error.message);
  }
}

