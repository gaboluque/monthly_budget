import { useMemo, useState } from 'react';
import type { CreateIncomeData, Income } from '../../lib/types/incomes';
import { Form, FormField, SubmitHandler } from '../forms/Form';
import { useAccounts } from '../../hooks/useAccounts';
import { FormActions } from '../ui/FormActions';

interface IncomeFormProps {
  onSubmit: (data: CreateIncomeData) => Promise<void>;
  onCancel: () => void;
  initialData?: Income;
}

const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const FORM_ID = 'income-form';

export function IncomeForm({ onSubmit, onCancel, initialData }: IncomeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accounts } = useAccounts();

  const accountOptions = useMemo(() => {
    return accounts.map((account) => ({
      value: account.id,
      label: account.name
    }));
  }, [accounts]);

  // Default values for the form
  const defaultValues: CreateIncomeData = {
    name: initialData?.name ?? undefined,
    amount: initialData?.amount ?? undefined,
    frequency: initialData?.frequency ?? undefined,
  };

  const handleSubmit: SubmitHandler<CreateIncomeData> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
      throw err; // Re-throw to let react-hook-form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields: FormField<CreateIncomeData>[] = [
    {
      name: 'name',
      label: 'Income Source',
      type: 'text',
      required: true,
      validation: {
        required: 'Income source is required'
      }
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      placeholder: '$0.00',
      required: true,
      validation: {
        required: 'Amount is required',
        min: {
          value: 0.01,
          message: 'Amount must be greater than 0'
        }
      }
    },
    {
      name: 'account_id',
      label: 'Account',
      type: 'select',
      options: accountOptions,
      required: true,
      validation: {
        required: 'Account is required'
      }
    },
    {
      name: 'frequency',
      label: 'Frequency',
      type: 'select',
      options: FREQUENCY_OPTIONS,
      required: true,
      validation: {
        required: 'Frequency is required'
      }
    },
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <Form<CreateIncomeData>
        id={FORM_ID}
        fields={formFields}
        onSubmit={handleSubmit}
        className="space-y-4"
        defaultValues={defaultValues}
      />

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        formId={FORM_ID}
        isEditing={!!initialData?.id}
      />
    </div>
  );
} 