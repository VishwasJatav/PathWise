"use client";

import {
  Brain,
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { m } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

/* ── Count-up hook ────────────────────────────────────── */
function useCountUp(target, duration = 1200, decimals = 0) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || typeof target !== "number") return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      ref.current.textContent =
        decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, decimals]);
  return ref;
}

/* ── Animated progress bar ────────────────────────────── */
function AnimatedBar({ widthPercent, colorClass }) {
  return (
    <div className="h-[3px] w-full rounded-full bg-muted mt-3 overflow-hidden">
      <m.div
        className={cn("h-full rounded-full", colorClass)}
        initial={{ width: 0 }}
        animate={{ width: `${widthPercent}%` }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.35 }}
      />
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */
const DashboardView = ({ insights }) => {

  /* salary data — safe fallback */
  const salaryData =
    insights?.salaryRanges?.map((range) => ({
      name: range.role,
      min:    Math.round(range.min    / 1000),
      max:    Math.round(range.max    / 1000),
      median: Math.round(range.median / 1000),
    })) ?? [];

  /* helpers */
  const getDemandLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":   return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low":    return "bg-red-500";
      default:       return "bg-gray-500";
    }
  };

  const getDemandProgress = (level) => {
    switch (level?.toLowerCase()) {
      case "high":   return 88;
      case "medium": return 52;
      case "low":    return 22;
      default:       return 50;
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook?.toLowerCase()) {
      case "positive":
        return {
          icon:       TrendingUp,
          color:      "text-green-400",
          accentClass:"card-accent-positive",
        };
      case "neutral":
        return {
          icon:       LineChart,
          color:      "text-yellow-400",
          accentClass:"card-accent-neutral",
        };
      case "negative":
        return {
          icon:       TrendingDown,
          color:      "text-red-400",
          accentClass:"card-accent-negative",
        };
      default:
        return {
          icon:       LineChart,
          color:      "text-muted-foreground",
          accentClass:"",
        };
    }
  };

  /* skill badge styles — cycle through 4 variants
     All use Tailwind semantic colors, no hardcoded hex      */
  const skillStyles = [
    "border-red-900/50   bg-red-950/40   text-red-400   hover:border-red-700/70",
    "border-green-900/50 bg-green-950/40 text-green-400 hover:border-green-700/70",
    /* primary blue tint — uses project's brand color family */
    "border-blue-900/50  bg-blue-950/40  text-blue-400  hover:border-blue-700/70",
    "border-amber-900/50 bg-amber-950/40 text-amber-400 hover:border-amber-700/70",
  ];

  /* count-up refs */
  const growthRef = useCountUp(insights?.growthRate ?? 0, 1200, 1);

  const {
    icon: OutlookIcon,
    color: outlookColor,
    accentClass: outlookAccent,
  } = getMarketOutlookInfo(insights?.marketOutlook);

  const lastUpdatedDate = insights?.lastUpdated
    ? format(new Date(insights.lastUpdated), "dd/MM/yyyy")
    : "—";
  const nextUpdateDistance = insights?.nextUpdate
    ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })
    : "—";

  return (
    <m.div
      className="space-y-4 pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* ── Header row ─────────────────────────────────────── */}
      <m.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <Badge
          variant="outline"
          className="gap-1.5 text-xs font-semibold
            text-emerald-400 border-emerald-900/60
            bg-emerald-950/40 px-3 py-1"
        >
          <CheckCircle2 size={11} />
          Last updated: {lastUpdatedDate}
        </Badge>
        <span className="text-[11px] text-muted-foreground/60">
          Next update {nextUpdateDistance}
        </span>
      </m.div>

      {/* ── 4 stat cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Market Outlook */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0 }}
        >
          <Card className={cn("dashboard-card-hover h-full", outlookAccent)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Market Outlook
              </CardTitle>
              <OutlookIcon size={18} className={outlookColor} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize count-up">
                {insights?.marketOutlook}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Next update {nextUpdateDistance}
              </p>
            </CardContent>
          </Card>
        </m.div>

        {/* Industry Growth */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <Card className="dashboard-card-hover h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Industry Growth
              </CardTitle>
              <TrendingUp size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold count-up">
                <span ref={growthRef}>0</span>%
              </div>
              {/* animated bar — gradient uses project primary blue */}
              <div className="h-[3px] w-full rounded-full bg-muted mt-3 overflow-hidden">
                <m.div
                  className="h-full rounded-full
                    bg-gradient-to-r from-indigo-500 to-cyan-400
                    [box-shadow:0_0_8px_rgba(56,189,248,0.5)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((insights?.growthRate ?? 0) * 10, 100)}%`,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.4,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </m.div>

        {/* Demand Level */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <Card className="dashboard-card-hover h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Demand Level
              </CardTitle>
              <BriefcaseIcon size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize count-up">
                {insights?.demandLevel}
              </div>
              <AnimatedBar
                widthPercent={getDemandProgress(insights?.demandLevel)}
                colorClass={getDemandLevelColor(insights?.demandLevel)}
              />
              <p className="text-xs mt-2 text-muted-foreground">
                Current industry demand
              </p>
            </CardContent>
          </Card>
        </m.div>

        {/* Top Skills */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
        >
          <Card className="dashboard-card-hover h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
              <Brain size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights?.topSkills?.map((skill) => (
                  <m.div
                    key={skill}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Badge
                      variant="secondary"
                      className="skill-badge-hover px-2 py-1 text-xs rounded-full"
                    >
                      {skill}
                    </Badge>
                  </m.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>

      {/* ── Salary chart ───────────────────────────────────── */}
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.32 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Displaying minimum, median, and maximum salaries (in thousands)
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData} barGap={4} barCategoryGap="28%">
                  <CartesianGrid
                    stroke="hsl(var(--border))"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}K`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-xl text-xs">
                          <p className="font-semibold text-foreground mb-2">
                            {label}
                          </p>
                          {payload.map((item) => (
                            <div
                              key={item.name}
                              className="flex justify-between gap-6 text-muted-foreground"
                            >
                              <span>{item.name}</span>
                              <span className="font-bold text-foreground">
                                ${item.value}K
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px" }}
                    formatter={(value) => (
                      <span
                        style={{
                          color: "hsl(var(--muted-foreground))",
                          fontSize: 11,
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="min"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    name="Min Salary (K)"
                    animationDuration={900}
                    animationBegin={0}
                  />
                  <Bar
                    dataKey="median"
                    fill="#a855f7"
                    radius={[4, 4, 0, 0]}
                    name="Median Salary (K)"
                    animationDuration={900}
                    animationBegin={150}
                  />
                  <Bar
                    dataKey="max"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                    name="Max Salary (K)"
                    animationDuration={900}
                    animationBegin={300}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </m.div>

      {/* ── Trends + Recommended Skills ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Key Trends */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <LineChart size={16} className="text-primary" />
              <CardTitle className="text-sm font-medium">
                Key Industry Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {insights?.keyTrends?.map((trend, index) => (
                <m.div
                  key={`trend-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.44 + index * 0.07,
                  }}
                  className="flex items-start gap-3 py-2.5 px-2 rounded-lg
                    hover:bg-accent/30 transition-colors duration-150
                    cursor-default group"
                >
                  <div
                    className={cn(
                      "w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[5px]",
                      "trend-dot-pulse",
                      "transition-transform duration-200 group-hover:scale-125",
                      index % 3 === 0
                        ? "bg-red-400"
                        : index % 3 === 1
                        ? "bg-green-400"
                        : "bg-primary"
                    )}
                  />
                  <span className="text-sm leading-relaxed">{trend}</span>
                </m.div>
              ))}
            </CardContent>
          </Card>
        </m.div>

        {/* Recommended Skills */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.46 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Brain size={16} className="text-primary" />
              <CardTitle className="text-sm font-medium">
                Recommended Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {insights?.recommendedSkills?.map((skill, index) => (
                  <m.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.5 + index * 0.05,
                    }}
                    whileHover={{ y: -1 }}
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "skill-badge-hover px-3 py-1 text-xs",
                        "rounded-md font-medium",
                        "transition-all duration-200",
                        skillStyles[index % 4]
                      )}
                    >
                      {skill}
                    </Badge>
                  </m.div>
                ))}
              </div>

              {/* color legend */}
              <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border/40">
                {[
                  { color: "bg-red-400",   label: "Hot demand" },
                  { color: "bg-green-400", label: "Rising"     },
                  { color: "bg-primary",   label: "Emerging"   },
                  { color: "bg-amber-400", label: "Steady"     },
                ].map(({ color, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60"
                  >
                    <div className={cn("w-[5px] h-[5px] rounded-full", color)} />
                    {label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>

      {/* ── 10-Year Outlook + Emerging Tech ────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Next Decade Outlook */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.56 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <TrendingUp size={16} className="text-primary" />
              <CardTitle className="text-sm font-medium">
                10-Year Industry Outlook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-[1.75]">
                {insights?.nextDecadeOutlook ||
                  "Data not available yet. Please refresh your insights."}
              </p>
            </CardContent>
          </Card>
        </m.div>

        {/* Emerging Technologies */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.62 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Brain size={16} className="text-primary" />
              <CardTitle className="text-sm font-medium">
                Emerging Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights?.emergingTechnologies?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {insights.emergingTechnologies.map((tech, index) => (
                    <m.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.25,
                        delay: 0.64 + index * 0.05,
                      }}
                      whileHover={{ y: -1 }}
                    >
                      <Badge
                        variant="outline"
                        className="skill-badge-hover px-3 py-1 text-xs
                          rounded-md font-medium
                          border-primary/30 text-primary bg-primary/10
                          hover:bg-primary/20 hover:border-primary/50
                          transition-all duration-200"
                      >
                        {tech}
                      </Badge>
                    </m.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Data not available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </m.div>
      </div>

    </m.div>
  );
};

export default DashboardView;
