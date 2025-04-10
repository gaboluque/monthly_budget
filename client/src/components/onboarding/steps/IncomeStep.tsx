import { Form, FormField } from "../../forms/Form";
import { incomeFields } from "../formFields";
import { OnboardingFormData } from "../types";

interface IncomeStepProps {
  formId: string;
  defaultValues: OnboardingFormData;
  onSubmit: (data: OnboardingFormData) => void;
}

export const IncomeStep = ({ formId, defaultValues, onSubmit }: IncomeStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Income Source</h3>
      <p className="text-gray-600">Add your primary income source to help plan your budget.</p>

      <div className="mt-2">
        <Form
          id={formId}
          fields={incomeFields as FormField<OnboardingFormData>[]}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  );
}; 