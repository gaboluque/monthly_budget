import { OnboardingFormData } from "./types";
import { formatStringArrayToOptions } from "../../lib/utils/formatters";
export interface FormField<T> {
  name: keyof T | string;
  label: string;
  type: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  validation?: {
    required?: string;
  };
  showWhen?: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
}

export const welcomeFields: FormField<OnboardingFormData>[] = [
  {
    name: "name",
    label: "What should we call you?",
    type: "text",
    placeholder: "Your name",
    validation: {
      required: "Please enter your name",
    },
  },
];

export const accountFields = (
  accountTypes: string[]
): FormField<OnboardingFormData>[] => {
  return [
    {
      name: "mainAccount.name",
      label: "Account Name",
      type: "text",
      placeholder: "e.g., Savings Account",
      validation: {
        required: "Please enter an account name",
      },
    },
    {
      name: "mainAccount.type",
      label: "Account Type",
      type: "select",
      options: formatStringArrayToOptions(accountTypes),
      validation: {
        required: "Please select an account type",
      },
    },
    {
      name: "mainAccount.balance",
      label: "Current Balance",
      type: "number",
      placeholder: "0.00",
      validation: {
        required: "Please enter a balance",
      },
    },
  ];
};

export const incomeFields: FormField<OnboardingFormData>[] = [
  {
    name: "income.name",
    label: "Income Source",
    type: "text",
    placeholder: "e.g., Salary, Freelance",
    validation: {
      required: "Please enter an income source",
    },
  },
  {
    name: "income.amount",
    label: "Amount",
    type: "number",
    placeholder: "0.00",
    validation: {
      required: "Please enter an income amount",
    },
  },
  {
    name: "income.frequency",
    label: "Frequency",
    type: "select",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "biweekly", label: "Bi-weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "yearly", label: "Yearly" },
    ],
    validation: {
      required: "Please select an income frequency",
    },
  },
];

export const budgetMethodFields: FormField<OnboardingFormData>[] = [
  {
    name: "budgetMethod",
    label: "Budget Method",
    type: "radio",
    options: [
      { value: "50-30-20", label: "50/30/20 Rule" },
      { value: "70-20-10", label: "70/20/10 Rule" },
      { value: "custom", label: "Custom Allocation" },
    ],
    validation: {
      required: "Please select a budget distribution",
    },
  },
];

export const customBudgetFields: FormField<OnboardingFormData>[] = [
  {
    name: "budgetDistribution.needs",
    label: "Needs %",
    type: "number",
    min: 0,
    max: 100,
    validation: {
      required: "Please enter a needs percentage",
    },
    showWhen: [{ field: "budgetMethod", operator: "equals", value: "custom" }],
  },
  {
    name: "budgetDistribution.wants",
    label: "Wants %",
    type: "number",
    min: 0,
    max: 100,
    validation: {
      required: "Please enter a wants percentage",
    },
    showWhen: [{ field: "budgetMethod", operator: "equals", value: "custom" }],
  },
  {
    name: "budgetDistribution.savings",
    label: "Savings %",
    type: "number",
    min: 0,
    max: 100,
    validation: {
      required: "Please enter a savings percentage",
    },
    showWhen: [{ field: "budgetMethod", operator: "equals", value: "custom" }],
  },
];

export const savingsGoalFields: FormField<OnboardingFormData>[] = [
  {
    name: "savingsGoal",
    label: "Monthly Savings Goal",
    type: "number",
    placeholder: "0.00",
    validation: {
      required: "Please enter a savings goal",
    },
  },
];
