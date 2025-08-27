"use client";

import { Brain, BriefcaseIcon, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    median: range.median / 1000,
    max: range.max / 1000,
  }));

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
    <motion.div
      className="space-y-6"
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
              <OutlookIcon className={`h-5 w-5 ${outlookColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{insights.marketOutlook}</div>
              <p className="text-xs text-muted-foreground">Next update {nextUpdateDistance}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Industry Growth */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</div>
              <Progress
                value={insights.growthRate}
                className="mt-3 bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-cyan-400 [&>div]:shadow-[0_0_8px_rgba(56,189,248,0.6)]"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Demand Level */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
              <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />
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
        </motion.div>

        {/* Top Skills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
              <Brain className="h-5 w-5 text-muted-foreground" />
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
        </motion.div>
      </div>

      {/* Salary Ranges Chart */}
      <motion.div
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
            <div className="h-[400px]">
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
                 <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Industry Trends & Recommended Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Industry Trends */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex items-center space-x-2 pb-2">
              <LineChart className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Key Industry Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {insights.keyTrends.map((trend, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-sm">{trend}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Skills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex items-center space-x-2 pb-2">
              <Brain className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Recommended Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.recommendedSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-xs rounded-full hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
