import { useMemo, useState } from 'react';
import type { CreateBudgetItemData, BudgetItem } from '../../lib/types/budget_items';
import { Form, FormField, SubmitHandler } from '../forms/Form';
import { useBudgetItems } from '../../hooks/useBudgetItems';
import { Spinner } from '../ui/Spinner';
import { FormActions } from '../ui/FormActions';

interface BudgetItemFormProps {
  onSubmit: (data: CreateBudgetItemData) => Promise<void>;
  onCancel: () => void;
  initialData?: BudgetItem | CreateBudgetItemData | null;
}

const FORM_ID = 'budgetItem-form';

export function BudgetItemForm({ onSubmit, onCancel, initialData }: BudgetItemFormProps) {
  const { categories, isLoading: isCategoriesLoading } = useBudgetItems();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = useMemo(() => {
    return categories.map((cat: string) => ({
      value: cat,
      label: cat
    }));
  }, [categories]);

  const defaultValues: CreateBudgetItemData = {
    name: initialData?.name ?? undefined,
    amount: initialData?.amount ?? undefined,
    category: initialData?.category ?? undefined,
  };

  const handleSubmit: SubmitHandler<CreateBudgetItemData> = async (data: CreateBudgetItemData) => {
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

  if (isCategoriesLoading) {
    return <Spinner />
  }

  const formFields: FormField<CreateBudgetItemData>[] = [
    {
      name: 'name',
      label: 'BudgetItem Name',
      type: 'text',
      placeholder: 'Enter budget item name',
      required: true,
      validation: {
        required: 'BudgetItem name is required'
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
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <Form<CreateBudgetItemData>
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