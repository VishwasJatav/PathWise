"use client";

import { Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A2E] border border-[#3A3A5E] p-3 rounded-lg shadow-xl">
        <p className="text-[#F0F0FF] font-medium mb-1">{label}</p>
        <p className="text-[#6C47FF] text-sm">Tokens: <span className="font-bold">{payload[0].value.toLocaleString()}</span></p>
        {payload[0].payload.calls !== undefined && (
          <p className="text-[#7070A0] text-xs mt-1">Calls: {payload[0].payload.calls}</p>
        )}
      </div>
    );
  }
  return null;
};

export function UsageCharts({ dailyData = [], featureData = [] }) {
  const COLORS = ["#6C47FF", "#4ADE80", "#34D399", "#F59E0B", "#60A5FA", "#F87171", "#7070A0"];

  const totalPieCalls = featureData.reduce((acc, curr) => acc + (curr.calls || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily Usage Area Chart */}
      <div className="lg:col-span-2 bg-[#0F0F1A] border border-[#1E1E2E] rounded-xl flex flex-col">
        <div className="px-6 py-5 border-b border-[#1E1E2E]">
          <h3 className="text-lg font-semibold text-[#F0F0FF]">Daily Token Usage (Last 30 Days)</h3>
        </div>
        <div className="p-6 flex-1 min-h-[350px]">
          {dailyData.length === 0 || dailyData.every(d => d.tokens === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#7070A0]">
              <Activity className="size- mb-4 opacity-50" />
              <p>No usage data yet. Start using AI features to see your consumption here.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C47FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6C47FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E1E2E" />
                <XAxis 
                  dataKey="date" 
                  stroke="#5A5A7A" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#5A5A7A" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#6C47FF" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTokens)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Feature Breakdown Donut Chart */}
      <div className="bg-[#0F0F1A] border border-[#1E1E2E] rounded-xl flex flex-col">
        <div className="px-6 py-5 border-b border-[#1E1E2E]">
          <h3 className="text-lg font-semibold text-[#F0F0FF]">Usage by Feature</h3>
        </div>
        <div className="p-6 flex-1 min-h-[350px] flex items-center justify-center relative">
          {featureData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={featureData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="tokens"
                    nameKey="feature"
                  >
                    {featureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1A1A2E", border: "1px solid #3A3A5E", borderRadius: "8px" }}
                    itemStyle={{ color: "#F0F0FF" }}
                    formatter={(value) => [value.toLocaleString(), "Tokens"]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={(value, entry) => {
                      const totalTokensAll = featureData.reduce((acc, c) => acc + c.tokens, 0);
                      const percentage = totalTokensAll > 0 ? ((entry.payload.tokens / totalTokensAll) * 100).toFixed(0) : 0;
                      return <span className="text-[#F0F0FF] text-xs">{value} ({percentage}%)</span>;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[calc(50%+18px)] text-center pointer-events-none">
                <span className="block text-2xl font-bold text-[#F0F0FF] leading-none">{totalPieCalls}</span>
                <span className="text-[10px] text-[#7070A0] uppercase tracking-wider">Calls</span>
              </div>
            </>
          ) : (
            <div className="text-[#7070A0] flex items-center justify-center h-full">
              No feature data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
