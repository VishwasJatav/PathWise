"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getApiUsageSummary() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  try {
    const usages = await db.apiUsage.findMany({
      where: { userId },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let totalTokens = 0;
    let thisMonthTokens = 0;
    let todayTokens = 0;
    const featureCounts = {};

    for (const u of usages) {
      totalTokens += u.totalTokens;
      
      const createdAt = new Date(u.createdAt);
      if (createdAt >= startOfMonth) {
        thisMonthTokens += u.totalTokens;
      }
      if (createdAt >= startOfToday) {
        todayTokens += u.totalTokens;
      }

      if (!featureCounts[u.feature]) featureCounts[u.feature] = 0;
      featureCounts[u.feature] += u.totalTokens;
    }

    let mostUsedFeature = "None";
    let maxTokens = -1;
    for (const [feat, tokens] of Object.entries(featureCounts)) {
      if (tokens > maxTokens) {
        maxTokens = tokens;
        mostUsedFeature = feat;
      }
    }

    return {
      totalTokens: Number(totalTokens),
      thisMonthTokens: Number(thisMonthTokens),
      todayTokens: Number(todayTokens),
      totalCalls: usages.length,
      mostUsedFeature,
    };
  } catch (error) {
    console.error("Error fetching API usage summary:", error);
    return { totalTokens: 0, thisMonthTokens: 0, todayTokens: 0, totalCalls: 0, mostUsedFeature: "None" };
  }
}

export async function getDailyUsage() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const usages = await db.apiUsage.findMany({
      where: { 
        userId,
        createdAt: { gte: thirtyDaysAgo }
      },
    });

    const dailyMap = {};
    for (const u of usages) {
      const d = new Date(u.createdAt);
      const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      if (!dailyMap[dateKey]) dailyMap[dateKey] = { tokens: 0, calls: 0 };
      dailyMap[dateKey].tokens += u.totalTokens;
      dailyMap[dateKey].calls += 1;
    }

    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      result.push({
        date: dateKey,
        tokens: dailyMap[dateKey]?.tokens || 0,
        calls: dailyMap[dateKey]?.calls || 0,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching daily usage:", error);
    return [];
  }
}

export async function getFeatureBreakdown() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const usages = await db.apiUsage.findMany({
      where: { userId },
    });

    const featureMap = {};
    for (const u of usages) {
      if (!featureMap[u.feature]) featureMap[u.feature] = { tokens: 0, calls: 0 };
      featureMap[u.feature].tokens += u.totalTokens;
      featureMap[u.feature].calls += 1;
    }

    const featureColors = {
      'cover-letter':      '#6C47FF',
      'resume-ats':        '#4ADE80',
      'resume-improve':    '#34D399',
      'interview-quiz':    '#F59E0B',
      'industry-insights': '#60A5FA',
      'career-coach':      '#F87171',
    };

    const result = Object.entries(featureMap).map(([feature, data]) => ({
      feature,
      tokens: data.tokens,
      calls: data.calls,
      color: featureColors[feature] || '#7070A0',
    }));

    return result.sort((a, b) => b.tokens - a.tokens);
  } catch (error) {
    console.error("Error fetching feature breakdown:", error);
    return [];
  }
}

export async function getRecentCalls() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const usages = await db.apiUsage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return usages.map(u => ({
      id: u.id,
      feature: u.feature,
      model: u.model,
      totalTokens: u.totalTokens,
      promptTokens: u.promptTokens,
      completionTokens: u.completionTokens,
      createdAt: new Date(u.createdAt).toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', 
        hour: 'numeric', minute: '2-digit', hour12: true 
      }),
      fullDate: new Date(u.createdAt).toISOString()
    }));
  } catch (error) {
    console.error("Error fetching recent calls:", error);
    return [];
  }
}
