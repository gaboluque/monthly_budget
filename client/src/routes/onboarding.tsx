
import OnboardingWizard from "../components/onboarding/OnboardingWizard";
import { useOnboarding } from "../hooks/useOnboarding";
import { OnboardingData } from "../lib/types/users";
export default function Onboarding() {
    const { accountTypes, submitOnboarding, onboardingSubmitting } = useOnboarding();

    const onComplete = (data: unknown) => {
        submitOnboarding(data as OnboardingData);
    }


    return <OnboardingWizard onComplete={onComplete} accountTypes={accountTypes} onboardingSubmitting={onboardingSubmitting} />;
}