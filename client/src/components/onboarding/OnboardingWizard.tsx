import { useState } from "react"
import { FormActions } from "../ui/FormActions"
import { OnboardingFormData } from "./types"
import {
    WelcomeStep,
    AccountStep,
    IncomeStep,
    BudgetMethodStep,
    SavingsGoalStep
} from "./steps"

export interface OnboardingWizardProps {
    onComplete: (formData: OnboardingFormData) => void;
    accountTypes: string[];
} 

export default function OnboardingWizard({ onComplete, accountTypes }: OnboardingWizardProps) {
    const [step, setStep] = useState(1)
    const [totalSteps] = useState(5)
    const [formData, setFormData] = useState<OnboardingFormData>({
        name: "",
        savingsGoal: 0,
        mainAccount: { name: "", type: "savings", balance: 0 },
        income: { name: "", amount: 0, frequency: "monthly" },
        budgetMethod: "50-30-20",
        budgetDistribution: { needs: 50, wants: 30, savings: 20 },
    })

    const prevStep = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleFormSubmit = (data: OnboardingFormData) => {
        const updatedFormData = { ...formData, ...data }
        setFormData(updatedFormData)

        if (step < totalSteps) setStep(step + 1)
        else onComplete(updatedFormData)
    }

    // Create a form ID for each step
    const formId = `onboarding-step-${step}`

    return (
        <div className="w-full max-w-2xl md:my-auto md:mx-auto md:rounded-lg md:shadow-lg">
            <div className="bg-blue-600 p-4 text-white md:rounded-t-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Pluto Setup Wizard</h2>
                    <span className="text-sm">
                        Step {step} of {totalSteps}
                    </span>
                </div>
                <div className="w-full bg-blue-400 h-1 mt-4 rounded-full overflow-hidden">
                    <div className="bg-white h-1 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                </div>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
                {step === 1 && (
                    <WelcomeStep
                        formId={formId}
                        defaultValues={formData}
                        onSubmit={handleFormSubmit}
                    />
                )}

                {step === 2 && (
                    <AccountStep
                        formId={formId}
                        defaultValues={formData}
                        accountTypes={accountTypes}
                        onSubmit={handleFormSubmit}
                    />
                )}

                {step === 3 && (
                    <IncomeStep
                        formId={formId}
                        defaultValues={formData}
                        onSubmit={handleFormSubmit}
                    />
                )}

                {step === 4 && (
                    <BudgetMethodStep
                        formId={formId}
                        defaultValues={formData}
                        onSubmit={handleFormSubmit}
                    />
                )}

                {step === 5 && (
                    <SavingsGoalStep
                        formId={formId}
                        defaultValues={formData}
                        onSubmit={handleFormSubmit}
                    />
                )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <FormActions
                    formId={formId} 
                    onCancel={step > 1 ? prevStep : undefined}
                    cancelLabel={step > 1 ? "Back" : undefined}
                    submitLabel={step < totalSteps ? "Next" : "Complete Setup"}
                />
            </div>
        </div>
    )
}
