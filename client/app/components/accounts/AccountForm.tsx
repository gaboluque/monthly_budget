import { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { Form, FormField, SubmitHandler } from '../forms/Form';
import type { CreateAccountData, Account, AccountType, Currency } from '../../lib/types/accounts';

interface AccountFormProps {
  onSubmit: (data: CreateAccountData) => Promise<void>;
  onCancel: () => void;
  initialData?: Account;
  accountTypes: AccountType[];
  currencies: Currency[];
}

const FORM_ID = 'account-form';

export function AccountForm({
  onSubmit,
  onCancel,
  initialData,
  accountTypes,
  currencies
}: AccountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accountTypeOptions = useMemo(() => {
    return accountTypes.map(type => ({
      value: type,
      label: type
    }));
  }, [accountTypes]);

  const currencyOptions = useMemo(() => {
    return currencies.map(currency => ({
      value: currency,
      label: currency
    }));
  }, [currencies]);

  // Default values for the form
  const defaultValues: CreateAccountData = {
    name: initialData?.name ?? undefined,
    balance: initialData?.balance ?? undefined,
    account_type: initialData?.account_type ?? accountTypes[0],
    currency: initialData?.currency ?? currencies[0],
    description: initialData?.description ?? undefined,
    is_owned: initialData?.is_owned ?? true,
  };

  const handleSubmit: SubmitHandler<CreateAccountData> = async (data) => {
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

  const formFields: FormField<CreateAccountData>[] = [
    {
      name: 'name',
      label: 'Account Name',
      type: 'text',
      placeholder: 'Enter account name',
      required: true,
      validation: {
        required: 'Account name is required'
      }
    },
    {
      name: 'balance',
      label: 'Balance',
      type: 'number',
      placeholder: '$0.00',
      required: true,
      validation: {
        required: 'Balance is required'
      }
    },
    {
      name: 'account_type',
      label: 'Account Type',
      type: 'select',
      options: accountTypeOptions,
      required: true,
      validation: {
        required: 'Account type is required'
      }
    },
    {
      name: 'currency',
      label: 'Currency',
      type: 'select',
      options: currencyOptions,
      required: true,
      validation: {
        required: 'Currency is required'
      }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Optional description for this account'
    },
    // Note: checkbox handling might need special attention in the NewForm component
    // This assumes the NewForm component can handle checkbox inputs
    {
      name: 'is_owned',
      label: 'I own this account',
      type: 'checkbox'
    }
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <Form<CreateAccountData>
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
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={submitForm}
        >
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
} 