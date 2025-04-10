
import OnboardingWizard from "../components/onboarding/OnboardingWizard";
import { useOnboarding } from "../hooks/useOnboarding";

export default function Onboarding() {
    const { accountTypes } = useOnboarding();

    const onComplete = (data: unknown) => {
        console.log(data);
    }


    return <OnboardingWizard onComplete={onComplete} accountTypes={accountTypes} />;
}