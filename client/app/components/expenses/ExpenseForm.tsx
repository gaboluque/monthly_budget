import { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../forms/Input';
import { Form, FormGroup, FormActions } from '../forms/Form';
import type { CreateExpenseData, Expense } from '../../lib/types/expenses';
import { CurrencyInput } from '../forms/CurrencyInput';
import { useAccounts } from '../../hooks/useAccounts';
import { useExpenses } from '../../hooks/useExpenses';

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

export function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { categories, isLoading: isCategoriesLoading } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateExpenseData | Expense>({
    account_id: accounts[0]?.id,
    category: categories[0],
    frequency: 'monthly',
    name: initialData?.name || '',
    amount: initialData?.amount || 0,
    id: initialData?.id,
  });

  useEffect(() => {
    if (!isAccountsLoading && !isCategoriesLoading) {
      setFormData({
        ...formData,
        account_id: accounts[0]?.id,
        category: categories[0],
      });
    }
  }, [isAccountsLoading, isCategoriesLoading, accounts, categories]);

  console.log({ formData, initialData });

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
    <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} error={error ?? undefined}>
      <FormGroup>
        <Input
          type="text"
          label="Expense Name"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          fullWidth
          helperText="Enter the name of the expense"
          autoComplete='off'
        />

        <CurrencyInput
          label="Amount"
          id="amount"
          value={formData.amount}
          onChange={(value) => setFormData({ ...formData, amount: value })}
          required
          fullWidth
          helperText="Enter the amount for this expense"
        />

        <Input
          type="select"
          label="Category"
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={categories.map(cat => ({ value: cat, label: cat }))}
          required
          fullWidth
          helperText="Select the category this expense belongs to"
        />

        <Input
          type="select"
          label="Account"
          id="account_id"
          value={formData.account_id}
          onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
          options={accounts.map((account) => ({
            value: account.id,
            label: `${account.name} (${account.account_type})`
          }))}
          required
          fullWidth
          helperText="Select the account this expense is paid from"
        />

        <Input
          type="select"
          label="Frequency"
          id="frequency"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Expense['frequency'] })}
          options={FREQUENCY_OPTIONS}
          required
          fullWidth
          helperText="How often do you pay this expense?"
        />
      </FormGroup>

      <FormActions>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        {!initialData?.id && (
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Saving...' : 'Create & Add Another'}
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update' : 'Create'}
        </Button>
      </FormActions>
    </Form>
  );
} 