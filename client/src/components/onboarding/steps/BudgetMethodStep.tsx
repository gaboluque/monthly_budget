import { Form, FormField } from "../../forms/Form";
import { budgetMethodFields, customBudgetFields } from "../formFields";
import { OnboardingFormData } from "../types";

interface BudgetMethodStepProps {
  formId: string;
  defaultValues: OnboardingFormData;
  onSubmit: (data: OnboardingFormData) => void;
}

export const BudgetMethodStep = ({ formId, defaultValues, onSubmit }: BudgetMethodStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Budget Method</h3>
      <p className="text-gray-600">Choose how you'd like to allocate your monthly income.</p>

      <Form
        id={formId}
        fields={[...budgetMethodFields, ...customBudgetFields] as FormField<OnboardingFormData>[]}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        className="mt-4"
      />

      {defaultValues.budgetMethod !== "custom" && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {defaultValues.budgetMethod === "50-30-20" ? (
              <span>50% for needs, 30% for wants, 20% for savings/debt</span>
            ) : (
              <span>70% for living expenses, 20% for savings, 10% for debt/donations</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}; 