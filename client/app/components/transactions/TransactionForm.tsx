import { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import type { CreateTransactionData } from '../../lib/api/transactions';
import { Transaction } from '../../lib/types/transactions';
import { Form, FormField, SubmitHandler } from '../forms/Form';
import { DefaultValues } from 'react-hook-form';
import { Account } from '../../lib/types/accounts';
import { Spinner } from '../ui/Spinner';

interface TransactionFormProps {
    onSubmit: (data: CreateTransactionData) => Promise<void>;
    onCancel: () => void;
    accounts: Account[];
    transactionTypes: string[];
    frequencies: string[];
    categories: string[];
    transaction?: Transaction | null;
    isSubmitting: boolean;
}

const FORM_ID = 'transaction-form';

export function TransactionForm({
    onSubmit,
    onCancel,
    accounts,
    transactionTypes,
    frequencies,
    categories,
    transaction,
    isSubmitting
}: TransactionFormProps) {
    const [error, setError] = useState<string | null>(null);

    const accountOptions = useMemo(() => {
        return accounts.map((account) => ({
            value: account.id,
            label: `${account.name} (${account.account_type})`
        }));
    }, [accounts]);

    const transactionTypeOptions = useMemo(() => {
        return transactionTypes.map(type => ({
            value: type,
            label: type
        }));
    }, [transactionTypes]);

    const frequencyOptions = useMemo(() => {
        return frequencies.map(frequency => ({
            value: frequency,
            label: frequency
        }));
    }, [frequencies]);

    const categoryOptions = useMemo(() => {
        return categories.map(category => ({
            value: category,
            label: category
        }));
    }, [categories]);

    // Default values for the form
    const defaultValues: Partial<CreateTransactionData> = {
        account_id: transaction?.account_id ?? undefined,
        recipient_account_id: transaction?.recipient_account_id ?? undefined,
        amount: transaction?.amount ?? undefined,
        transaction_type: transaction?.transaction_type ?? undefined,
        description: transaction?.description ?? undefined,
        executed_at: transaction?.executed_at ? new Date(transaction.executed_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        frequency: transaction?.frequency ?? 'one_time',
        category: transaction?.category ?? undefined,
    };

    const handleSubmit: SubmitHandler<CreateTransactionData> = async (data) => {
        setError(null);
        try {
            await onSubmit(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while saving');
            throw err;
        }
    };

    const submitForm = () => {
        const form = document.getElementById(FORM_ID) as HTMLFormElement;
        if (form) form.requestSubmit();
    };

    if (!accounts.length || !transactionTypes.length) {
        return <Spinner />;
    }

    // Define form fields with conditional visibility
    const formFields: FormField<CreateTransactionData>[] = [
        {
            name: 'transaction_type',
            label: 'Transaction Type',
            type: 'select',
            options: transactionTypeOptions,
            required: true,
            validation: {
                required: 'Transaction type is required'
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
            name: 'recipient_account_id',
            label: 'Recipient Account',
            type: 'select',
            options: accountOptions,
            required: true,
            validation: {
                required: 'Recipient account is required'
            },
            showWhen: [
                {
                    field: 'transaction_type',
                    operator: 'includes',
                    value: ['transfer']
                }
            ]
        },
        {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: categoryOptions
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
            name: 'description',
            label: 'Description',
            type: 'text',
            placeholder: 'Enter transaction description',
        },
        {
            name: 'executed_at',
            label: 'Date',
            type: 'date',
            required: true,
            validation: {
                required: 'Date is required'
            }
        },
        {
            name: 'frequency',
            label: 'Frequency',
            type: 'select',
            options: frequencyOptions,
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

            <Form<CreateTransactionData>
                id={FORM_ID}
                fields={formFields}
                onSubmit={handleSubmit}
                className="space-y-4"
                defaultValues={defaultValues as DefaultValues<CreateTransactionData>}
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
                    {isSubmitting ? 'Saving...' : (transaction?.id ? 'Update' : 'Create')}
                </Button>
            </div>
        </div>
    );
} 