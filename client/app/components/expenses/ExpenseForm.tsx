import { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../forms/Input';
import { Form, FormGroup, FormActions } from '../forms/Form';
import type { CreateExpenseData, Expense } from '../../lib/types/expenses';
import { expensesApi } from '../../lib/api/expenses';
import { formatCurrency } from '../../lib/utils/currency';
import { Autocomplete } from '../forms/Autocomplete';
import { ui } from '../../lib/ui/manager';

interface ExpenseFormProps {
  onSubmit: (data: CreateExpenseData) => Promise<void>;
  onCancel: () => void;
  initialData?: Expense;
  onCreateAnother?: () => void;
}

const EXPENSE_NAME_OPTIONS = [
  { value: 'Rent', label: 'Rent' },
  { value: 'Mortgage', label: 'Mortgage' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Internet', label: 'Internet' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'Groceries', label: 'Groceries' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Gas', label: 'Gas' },
  { value: 'Car Payment', label: 'Car Payment' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Dining Out', label: 'Dining Out' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Savings', label: 'Savings' },
  { value: 'Investments', label: 'Investments' },
  { value: 'Debt Payment', label: 'Debt Payment' },
];

const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
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

export function ExpenseForm({ onSubmit, onCancel, initialData, onCreateAnother }: ExpenseFormProps) {
  const [formData, setFormData] = useState<CreateExpenseData>({
    name: initialData?.name ?? '',
    amount: initialData?.amount ?? 0,
    category: initialData?.category ?? '',
    destination: initialData?.destination ?? '',
    frequency: initialData?.frequency ?? 'monthly',
  });
  const [displayAmount, setDisplayAmount] = useState(formatCurrency(formData.amount));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await expensesApi.getCategories();
        setCategories(data);
      } catch (err) {
        ui.notify({
          message: 'Failed to fetch categories',
          type: 'error',
        });
      }
    };
    fetchCategories();
  }, []);


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrencyInput(rawValue);
    setFormData({ ...formData, amount: numericValue });
    setDisplayAmount(formatCurrency(numericValue));
  };

  const handleAmountFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = formData.amount.toString();
    e.target.select();
  };

  const handleAmountBlur = () => {
    setDisplayAmount(formatCurrency(formData.amount));
  };

  const handleSubmit = async (createAnother: boolean = false) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(formData);
      if (createAnother && onCreateAnother) {
        onCreateAnother();
        // Reset form data
        setFormData({
          name: '',
          amount: 0,
          category: '',
          destination: '',
          frequency: 'monthly',
        });
        setDisplayAmount(formatCurrency(0));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} error={error ?? undefined}>
      <FormGroup>
        <Autocomplete
          label="Expense Name"
          id="name"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          options={EXPENSE_NAME_OPTIONS.map(option => option.label)}
          required
          fullWidth
          helperText="Select or type the expense you want to add"
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
          type="text"
          label="Destination"
          id="destination"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          required
          fullWidth
          helperText="Enter where this expense is paid to (e.g., landlord, utility company)"
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
        {!initialData?.id && onCreateAnother && (
          <Button 
            type="button" 
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
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