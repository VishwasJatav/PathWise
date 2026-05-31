"use client";

import { Brain, BriefcaseIcon, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { m } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashboardView = ({ insights }) => {
  // ✅ Prevent crash if insights or salaryRanges is missing
  const salaryData = insights?.salaryRanges?.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  })) || []; // fallback empty array
  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-400" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-400" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-400" };
      default:
        return { icon: LineChart, color: "text-gray-400" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(insights.marketOutlook);
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true });

  return (
    <m.div
      className="gap-y-"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Last Updated Badge */}
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          Last updated: {lastUpdatedDate}
        </Badge>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Outlook */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
              <OutlookIcon className={`size- ${outlookColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{insights.marketOutlook}</div>
              <p className="text-xs text-muted-foreground">Next update {nextUpdateDistance}</p>
            </CardContent>
          </Card>
        </m.div>

        {/* Industry Growth */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
              <TrendingUp className="size- text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</div>
              <Progress
                value={insights.growthRate}
                className="mt-3 bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-cyan-400 [&>div]:shadow-[0_0_8px_rgba(56,189,248,0.6)]"
              />
            </CardContent>
          </Card>
        </m.div>

        {/* Demand Level */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
              <BriefcaseIcon className="size- text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{insights.demandLevel}</div>
              <div
                className={`h-2 w-full rounded-full mt-3 ${getDemandLevelColor(
                  insights.demandLevel
                )}`}
              />
              <p className="text-xs mt-1 text-muted-foreground">Current industry demand</p>
            </CardContent>
          </Card>
        </m.div>

        {/* Top Skills */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
              <Brain className="size- text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.topSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-2 py-1 text-xs rounded-full hover:shadow-[0_0_6px_rgba(255,255,255,0.5)] transition"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>

      {/* Salary Ranges Chart */}
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <CardDescription>Displaying minimum, median, and maximum salaries (in thousands)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-gray-700 rounded-lg p-2 shadow-md">
                            <p className="font-medium text-sm">{label}</p>
                            {payload.map((item) => (
                              <p key={item.name} className="text-xs text-muted-foreground">
                                {item.name}: ${item.value}K
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="min" fill="#6366f1" radius={[4, 4, 0, 0]} name="Min Salary (K)" />
                  <Bar dataKey="median" fill="#a855f7" radius={[4, 4, 0, 0]} name="Median Salary (K)" />
                  <Bar dataKey="max" fill="#ec4899" radius={[4, 4, 0, 0]} name="Max Salary (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </m.div>

      {/* Industry Trends & Recommended Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Industry Trends */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex items-center gap-x- pb-2">
              <LineChart className="size- text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Key Industry Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="gap-y-">
                {insights.keyTrends.map((trend, index) => (
                  <li key={trend} className="flex items-center gap-x-">
                    <div className="size- rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-sm">{trend}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </m.div>

        {/* Recommended Skills */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex items-center gap-x- pb-2">
              <Brain className="size- text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Recommended Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.recommendedSkills.map((skill, index) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 text-xs rounded-full hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>

      {/* Futuristic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Next Decade Outlook */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="h-full">
            <CardHeader className="flex items-center gap-x- pb-2">
              <TrendingUp className="size- text-muted-foreground" />
              <CardTitle className="text-sm font-medium">10-Year Industry Outlook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insights.nextDecadeOutlook || "Data not available yet. Please refresh your insights."}
              </p>
            </CardContent>
          </Card>
        </m.div>

        {/* Emerging Technologies */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="h-full">
            <CardHeader className="flex items-center gap-x- pb-2">
              <Brain className="size- text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Emerging Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.emergingTechnologies?.length > 0 ? (
                  insights.emergingTechnologies.map((tech, index) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="px-3 py-1 text-xs rounded-full border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all"
                    >
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Data not available yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>
    </m.div>
  );
};

export default DashboardView;
