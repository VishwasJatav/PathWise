import { getUserOnboardingStatus, getUserProfile } from "@/actions/user";
import SettingsForm from "./_components/settings-form";
import { redirect } from "next/navigation";
import { industries } from "@/data/industries";

export const metadata = {
  title: 'Settings — Rixora',
  description: 'Manage your industry, specialization, skills, and profile preferences.',
};

const SettingsPage = async () => {
    const { isOnboarded } = await getUserOnboardingStatus();
    if (!isOnboarded) {
        redirect("/onboarding");
    }

    const userProfile = await getUserProfile();

    return (
        <div className="container mx-auto px-4 md:px-8 py-6">
            <SettingsForm userProfile={userProfile} industries={industries} />
        </div>
    );
};

export default SettingsPage;
