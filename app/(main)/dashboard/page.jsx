import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";
import Pattern from "./_components/pattern";

export const metadata = {
  title: 'Dashboard | Rixora',
  description: 'Your personalized career insights and industry trends dashboard.',
};

const IndustryInsightsPage = async () => {
    const { isOnboarded } = await getUserOnboardingStatus();
    const insights = await getIndustryInsights();
    if (!isOnboarded) {
        redirect("/onboarding");
    }
    return(
         <div className="container mx-auto">
         <Pattern />
         <DashboardView insights={insights} />
    </div>
    );
};

export default IndustryInsightsPage;