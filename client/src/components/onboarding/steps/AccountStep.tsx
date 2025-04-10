import { Form, FormField } from "../../forms/Form";
import { accountFields } from "../formFields";
import { OnboardingFormData } from "../types";

interface AccountStepProps {
  formId: string;
  defaultValues: OnboardingFormData;
  onSubmit: (data: OnboardingFormData) => void;
  accountTypes: string[];
}

export const AccountStep = ({ formId, defaultValues, onSubmit, accountTypes }: AccountStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Main Account</h3>
      <p className="text-gray-600">Let's start by setting up your primary bank account.</p>

      <Form
        id={formId}
        fields={accountFields(accountTypes) as FormField<OnboardingFormData>[]}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />
    </div>
  );
}; 