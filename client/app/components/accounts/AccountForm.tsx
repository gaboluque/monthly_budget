import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../forms/Input';
import { CurrencyInput } from '../forms/CurrencyInput';
import { Form, FormGroup, FormActions } from '../forms/Form';
import type { CreateAccountData, Account, AccountType, Currency } from '../../lib/types/accounts';

interface AccountFormProps {
  onSubmit: (data: CreateAccountData) => Promise<void>;
  onCancel: () => void;
  initialData?: Account;
  accountTypes: AccountType[];
  currencies: Currency[];
}

export function AccountForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  accountTypes, 
  currencies 
}: AccountFormProps) {
  const [formData, setFormData] = useState<CreateAccountData>({
    name: initialData?.name ?? '',
    balance: initialData?.balance ?? 0,
    account_type: initialData?.account_type ?? 'Checking',
    currency: initialData?.currency ?? 'USD',
    description: initialData?.description ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBalanceChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      balance: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          type="text"
          label="Account Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          fullWidth
          helperText="Enter the name of your account"
          autoComplete="off"
        />

        <CurrencyInput
          label="Balance"
          id="balance"
          value={formData.balance}
          onChange={handleBalanceChange}
          required
          fullWidth
          helperText="Enter the current balance of this account"
        />

        <Input
          type="select"
          label="Account Type"
          id="account_type"
          name="account_type"
          value={formData.account_type}
          onChange={handleSelectChange}
          options={accountTypes.map(type => ({ value: type, label: type }))}
          required
          fullWidth
          helperText="Select the type of account"
        />

        <Input
          type="select"
          label="Currency"
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleSelectChange}
          options={currencies.map(currency => ({ value: currency, label: currency }))}
          required
          fullWidth
          helperText="Select the currency for this account"
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional description for this account
          </p>
        </div>
      </FormGroup>

      <FormActions>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update' : 'Create'}
        </Button>
      </FormActions>
    </Form>
  );
} 