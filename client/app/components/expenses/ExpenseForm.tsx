import { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import type { CreateExpenseData, Expense } from '../../lib/types/expenses';
import { Form, FormField, SubmitHandler } from '../forms/Form';
import { useAccounts } from '../../hooks/useAccounts';
import { useExpenses } from '../../hooks/useExpenses';
import { Spinner } from '../ui/Spinner';

interface ExpenseFormProps {
  onSubmit: (data: CreateExpenseData) => Promise<void>;
  onCancel: () => void;
  initialData?: Expense | CreateExpenseData | null;
}

const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
];

const FORM_ID = 'expense-form';

export function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { categories, isLoading: isCategoriesLoading } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accountOptions = useMemo(() => {
    return accounts.map((account) => ({
      value: account.id,
      label: `${account.name} (${account.account_type})`
    }));
  }, [accounts]);

  const categoryOptions = useMemo(() => {
    return categories.map(cat => ({
      value: cat,
      label: cat
    }));
  }, [categories]);

  // Default values for the form
  const defaultValues: CreateExpenseData = {
    name: initialData?.name ?? undefined,
    amount: initialData?.amount ?? undefined,
    category: initialData?.category ?? undefined,
    account_id: initialData?.account_id ?? undefined,
    frequency: initialData?.frequency ?? undefined,
  };

  const handleSubmit: SubmitHandler<CreateExpenseData> = async (data) => {
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

  const submitForm = () => {
    const form = document.getElementById(FORM_ID) as HTMLFormElement;
    if (form) form.requestSubmit();
  };

  if (isAccountsLoading || isCategoriesLoading) {
    return <Spinner />
  }

  const formFields: FormField<CreateExpenseData>[] = [
    {
      name: 'name',
      label: 'Expense Name',
      type: 'text',
      placeholder: 'Enter expense name',
      required: true,
      validation: {
        required: 'Expense name is required'
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
      name: 'category',
      label: 'Category',
      type: 'select',
      options: categoryOptions,
      required: true,
      validation: {
        required: 'Category is required'
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

      <Form<CreateExpenseData>
        id={FORM_ID}
        fields={formFields}
        onSubmit={handleSubmit}
        className="space-y-4"
        defaultValues={defaultValues}
      />

      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        {!initialData?.id && (
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={submitForm}
          >
            {isSubmitting ? 'Saving...' : 'Create & Add Another'}
          </Button>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={submitForm}
        >
          {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update' : 'Create')}
        </Button>
      </div>
    </div>
  );
} 