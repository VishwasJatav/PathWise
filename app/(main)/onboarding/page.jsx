import { getUserOnboardingStatus } from "@/actions/user";
import OnboardingForm from "./_components/onboarding-form";
import { redirect } from "next/navigation";
import {industries} from "@/data/industries";

const OnboardingPage = async () => {
    const { isOnboarded } = await getUserOnboardingStatus();
    if (isOnboarded) {
        redirect("/dashboard");
    }
    return (
        <main>
            <OnboardingForm industries={industries} />
     
        </main>
    );
};

export default OnboardingPage;