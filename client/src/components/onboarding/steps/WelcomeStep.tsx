import { Check } from "lucide-react";
import { Form, FormField } from "../../forms/Form";
import { welcomeFields } from "../formFields";
import { OnboardingFormData } from "../types";

interface WelcomeStepProps {
  formId: string;
  defaultValues: OnboardingFormData;
  onSubmit: (data: OnboardingFormData) => void;
}

export const WelcomeStep = ({ formId, defaultValues, onSubmit }: WelcomeStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Welcome to Pluto!</h3>
      <p className="text-gray-600">
        Let's set up your budget in just a few steps. This wizard will help you configure your accounts, income
        sources, and budget allocations.
      </p>

      <div className="grid gap-3 mt-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-2 mt-1">
            <Check className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Quick Setup</h4>
            <p className="text-sm text-gray-500">Get started in minutes with our guided process</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-2 mt-1">
            <Check className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Personalized Budget</h4>
            <p className="text-sm text-gray-500">Create a budget that fits your financial goals</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-2 mt-1">
            <Check className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Track Everything</h4>
            <p className="text-sm text-gray-500">Monitor your spending and income in one place</p>
          </div>
        </div>
      </div>

      <Form
        id={formId}
        fields={welcomeFields as FormField<OnboardingFormData>[]}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />
    </div>
  );
}; 