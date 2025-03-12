import { useState } from 'react';
import { Button } from './Button';
import { Input } from './forms/Input';
import { Form, FormGroup, FormActions } from './forms/Form';
import type { CreateIncomeData, Income } from '../lib/api/incomes';
import { formatCurrency } from '../utils/currency';

interface IncomeFormProps {
  onSubmit: (data: CreateIncomeData) => Promise<void>;
  onCancel: () => void;
  initialData?: Income;
}

const INCOME_SOURCE_OPTIONS = [
  { value: 'Salary', label: 'Salary' },
  { value: 'Bonus', label: 'Bonus' },
  { value: 'Commission', label: 'Commission' },
  { value: 'Freelance Income', label: 'Freelance Income' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Investment Income', label: 'Investment Income' },
  { value: 'Dividends', label: 'Dividends' },
  { value: 'Rental Income', label: 'Rental Income' },
  { value: 'Side Business', label: 'Side Business' },
  { value: 'Pension', label: 'Pension' },
  { value: 'Social Security', label: 'Social Security' },
  { value: 'Royalties', label: 'Royalties' },
  { value: 'Interest Income', label: 'Interest Income' },
  { value: 'Other', label: 'Other' },
];

const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const parseCurrencyInput = (value: string): number => {
  // Remove currency symbol, commas, and other non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = numericValue.split('.');
  if (parts.length > 2) return 0;
  
  // If there's a decimal point, ensure only 2 decimal places
  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2);
  }
  
  return Number(parts.join('.')) || 0;
};

export function IncomeForm({ onSubmit, onCancel, initialData }: IncomeFormProps) {
  const [formData, setFormData] = useState<CreateIncomeData>({
    name: initialData?.name ?? 'salary',
    amount: initialData?.amount ?? 0,
    frequency: initialData?.frequency ?? 'monthly',
  });
  const [displayAmount, setDisplayAmount] = useState(formatCurrency(formData.amount));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrencyInput(rawValue);
    setFormData({ ...formData, amount: numericValue });
    setDisplayAmount(formatCurrency(numericValue));
  };

  const handleAmountFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // When focusing, show the raw number without currency formatting
    e.target.value = formData.amount.toString();
    e.target.select();
  };

  const handleAmountBlur = () => {
    // When blurring, format the number as currency
    setDisplayAmount(formatCurrency(formData.amount));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} error={error ?? undefined}>
      <FormGroup>
        <Input
          type="select"
          label="Income Source"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          options={INCOME_SOURCE_OPTIONS}
          required
          fullWidth
          helperText="Select the type of income you want to add"
        />

        <Input
          label="Amount"
          id="amount"
          type="text"
          inputMode="decimal"
          value={displayAmount}
          onChange={handleAmountChange}
          onFocus={handleAmountFocus}
          onBlur={handleAmountBlur}
          required
          fullWidth
          helperText="Enter the amount for this income source"
        />

        <Input
          type="select"
          label="Frequency"
          id="frequency"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Income['frequency'] })}
          options={FREQUENCY_OPTIONS}
          required
          fullWidth
          helperText="How often do you receive this income?"
        />
      </FormGroup>

      <FormActions>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </Button>
      </FormActions>
    </Form>
  );
} 