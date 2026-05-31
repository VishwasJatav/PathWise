import { getApiUsageSummary, getDailyUsage, getFeatureBreakdown, getRecentCalls } from "@/actions/api-usage";
import { UsageCharts } from "./_components/usage-charts";
import { Activity, Zap, BarChart2, Star, Clock } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = { title: 'API Usage | Rixora' };

function formatFeatureName(feature) {
  const customMap = {
    'cover-letter': 'Cover Letter',
    'resume-ats': 'Resume ATS',
    'resume-improve': 'Resume Improve',
    'interview-quiz': 'Interview Quiz',
    'industry-insights': 'Industry Insights',
    'career-coach': 'Career Coach'
  };
  if (customMap[feature]) return customMap[feature];
  return feature.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function ApiUsagePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  // Admin Guard
  if (email !== "vishwasjatav@gmail.com") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#0A0A0F]">
        <div className="text-center p-8 bg-[#0F0F1A] border border-[#1E1E2E] rounded-xl max-w-md">
          <Activity className="size- text-[#6C47FF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F0F0FF] mb-2">Access Restricted</h2>
          <p className="text-[#7070A0]">You do not have permission to view the API Usage Dashboard.</p>
        </div>
      </div>
    );
  }

  const [summary, daily, features, recent] = await Promise.all([
    getApiUsageSummary(),
    getDailyUsage(),
    getFeatureBreakdown(),
    getRecentCalls(),
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto gap-y-">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Activity className="size- text-[#6C47FF]" />
              <h1 className="text-3xl font-bold tracking-tight text-[#F0F0FF]">API Usage</h1>
            </div>
            <p className="text-[#7070A0]">Monitor your AI token consumption across all features</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0F0F1A] border border-[#1E1E2E] rounded-lg p-1">
            <button type="button" className="px-4 py-1.5 text-sm rounded-md text-[#7070A0] hover:text-[#F0F0FF] transition-colors">Last 7 Days</button>
            <button type="button" className="px-4 py-1.5 text-sm rounded-md text-[#F0F0FF] bg-[#1E1E2E] shadow-sm">Last 30 Days</button>
            <button type="button" className="px-4 py-1.5 text-sm rounded-md text-[#7070A0] hover:text-[#F0F0FF] transition-colors">All Time</button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-[#0F0F1A] border border-[#1E1E2E] rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#7070A0] mb-1">Total Tokens Used</p>
                <h3 className="text-2xl font-bold text-[#F0F0FF]">{summary.totalTokens.toLocaleString()}</h3>
              </div>
              <div className="p-2 rounded-lg bg-[#1E1030]">
                <Activity className="size- text-[#A78BFA]" />
              </div>
            </div>
            <p className="text-xs text-[#7070A0] mt-4">Lifetime token consumption</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0F0F1A] border border-[#1E1E2E] rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#7070A0] mb-1">Tokens This Month</p>
                <h3 className="text-2xl font-bold text-[#F0F0FF]">{summary.thisMonthTokens.toLocaleString()}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Zap className="size- text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-[#7070A0] mt-4">Tokens consumed in {new Date().toLocaleString('default', { month: 'long' })}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0F0F1A] border border-[#1E1E2E] rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#7070A0] mb-1">API Calls Today</p>
                <h3 className="text-2xl font-bold text-[#F0F0FF]">{summary.todayTokens.toLocaleString()}</h3>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <BarChart2 className="size- text-green-400" />
              </div>
            </div>
            <p className="text-xs text-[#7070A0] mt-4">Tokens used today</p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#0F0F1A] border border-[#1E1E2E] rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#7070A0] mb-1">Most Used Feature</p>
                <h3 className="text-2xl font-bold text-[#F0F0FF]">{formatFeatureName(summary.mostUsedFeature)}</h3>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Star className="size- text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-[#7070A0] mt-4">Highest consumption feature</p>
          </div>
        </div>

        {/* CHARTS */}
        <UsageCharts dailyData={daily} featureData={features} />

        {/* RECENT CALLS TABLE */}
        <div className="bg-[#0F0F1A] border border-[#1E1E2E] rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#1E1E2E] flex items-center gap-2">
            <Clock className="size- text-[#6C47FF]" />
            <h3 className="text-lg font-semibold text-[#F0F0FF]">Recent API Calls</h3>
          </div>
          
          <div className="overflow-x-auto">
            {recent.length === 0 ? (
              <div className="py-12 text-center text-[#7070A0] flex flex-col items-center justify-center">
                <Activity className="size- mb-3 opacity-50" />
                <p>No API calls recorded yet</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#7070A0] uppercase bg-[#0A0A0F]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Feature</th>
                    <th className="px-6 py-4 font-semibold">Model</th>
                    <th className="px-6 py-4 font-semibold">Prompt Tokens</th>
                    <th className="px-6 py-4 font-semibold">Completion Tokens</th>
                    <th className="px-6 py-4 font-semibold">Total Tokens</th>
                    <th className="px-6 py-4 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E2E]">
                  {recent.map((call, index) => {
                    const featColor = features.find(f => f.feature === call.feature)?.color || '#7070A0';
                    const isEven = index % 2 === 0;
                    return (
                      <tr key={call.id} className={`${isEven ? 'bg-[#0F0F1A]' : 'bg-[#0C0C18]'} hover:bg-[#1E1E2E]/50 transition-colors`}>
                        <td className="px-6 py-4">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${featColor}1A`, color: featColor, border: `1px solid ${featColor}33` }}
                          >
                            {formatFeatureName(call.feature)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-[#1E1E2E] text-[#F0F0FF]">
                            {call.model === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' : 
                             call.model === 'groq-llama3' ? 'Groq Llama3' : 
                             call.model === 'ollama-llama3' ? 'Ollama Local' : call.model}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#7070A0]">{call.promptTokens.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#7070A0]">{call.completionTokens.toLocaleString()}</td>
                        <td className="px-6 py-4 font-semibold text-[#F0F0FF]">{call.totalTokens.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#7070A0] text-xs" title={call.fullDate}>
                          {call.createdAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
