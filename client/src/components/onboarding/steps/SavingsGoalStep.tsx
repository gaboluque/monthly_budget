import { Form, FormField } from "../../forms/Form";
import { savingsGoalFields } from "../formFields";
import { OnboardingFormData } from "../types";

interface SavingsGoalStepProps {
  formId: string;
  defaultValues: OnboardingFormData;
  onSubmit: (data: OnboardingFormData) => void;
}

export const SavingsGoalStep = ({ formId, defaultValues, onSubmit }: SavingsGoalStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Almost Done!</h3>
      <p className="text-gray-600">Let's set your savings goal to help you stay on track.</p>

      <Form
        id={formId}
        fields={savingsGoalFields as FormField<OnboardingFormData>[]}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        className="mt-4"
      />
      <p className="text-xs text-gray-500 mt-1">This is how much you aim to save each month.</p>
    </div>
  );
}; 