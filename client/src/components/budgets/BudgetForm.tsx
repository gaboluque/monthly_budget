import { useState } from 'react';
import type { CreateBudgetData, Budget } from '../../lib/types/budgets';
import { Form, FormField, SubmitHandler } from '../forms/Form';
import { FormActions } from '../ui/FormActions';
import { Button } from '../ui/Button';

interface BudgetFormProps {
  onSubmit: (data: CreateBudgetData) => Promise<void>;
  onCancel: () => void;
  onDelete: () => void;
  initialData?: Budget | CreateBudgetData | null;
  natures: string[];
}

const FORM_ID = 'budget-form';

export function BudgetForm({ onSubmit, onCancel, initialData, natures, onDelete }: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues: CreateBudgetData = {
    name: initialData?.name ?? undefined,
    amount: initialData?.amount ?? undefined,
    nature: initialData?.nature ?? "need",
  };

  const natureOptions = natures.map((nature: string) => ({
    label: nature,
    value: nature,
  }));

  const handleSubmit: SubmitHandler<CreateBudgetData> = async (data: CreateBudgetData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields: FormField<CreateBudgetData>[] = [
    {
      name: 'name',
      label: 'Budget Item Name',
      type: 'text',
      placeholder: 'Enter budget item name',
      required: true,
      validation: {
        required: 'Budget item name is required'
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
      name: 'nature',
      label: 'Nature',
      type: 'select',
      options: natureOptions,
      required: true,
    }
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <Form<CreateBudgetData>
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
        additionalActions={
          <div className="flex flex-row justify-end gap-2">
            {initialData?.id ? (
              <Button
                type="button"
                variant="danger"
                onClick={onDelete}
              >
                Delete
              </Button>
            ) : null}
          </div>
        }
      />
    </div>
  );
} 