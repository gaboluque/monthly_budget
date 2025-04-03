import { useMemo, useState } from 'react';
import type { CreateTransactionData } from '../../lib/api/transactions';
import { Transaction } from '../../lib/types/transactions';
import { Form, FormField, SubmitHandler } from '../forms/Form';
import { Account } from '../../lib/types/accounts';
import { Spinner } from '../ui/Spinner';
import { formatCurrency } from '../../lib/utils/currency';
import { formatISODate, formatLabel } from '../../lib/utils/formatters';
import { FormActions } from '../ui/FormActions';
import { BudgetItem } from '../../lib/types/budget_items';

interface TransactionFormProps {
    onSubmit: (data: CreateTransactionData) => Promise<void>;
    onCancel: () => void;
    accounts: Account[];
    transactionTypes: string[];
    categories: string[];
    transaction?: Transaction | null;
    isSubmitting: boolean;
    isBudgetItemsLoading: boolean;
    budgetItems: BudgetItem[];
}

const FORM_ID = 'transaction-form';

export function TransactionForm({
    onSubmit,
    onCancel,
    accounts,
    transactionTypes,
    transaction,
    isSubmitting,
    isBudgetItemsLoading,
    budgetItems
}: TransactionFormProps) {
    const [error, setError] = useState<string | null>(null);

    const accountOptions = useMemo(() => {
        return accounts.map((account) => ({
            value: account.id,
            label: `${account.name} (${formatCurrency(account.balance)})`
        }));
    }, [accounts]);

    const transactionTypeOptions = useMemo(() => {
        return transactionTypes.map(type => ({
            value: type,
            label: formatLabel(type)
        }));
    }, [transactionTypes]);

    const budgetItemOptions = useMemo(() => {
        return budgetItems.map(budgetItem => ({
            value: budgetItem.id,
            label: `${budgetItem.name} (${budgetItem.category})`
        }));
    }, [budgetItems]);

    // Default values for the form
    const defaultValues: Partial<CreateTransactionData> = {
        account_id: transaction?.account_id ?? undefined,
        recipient_account_id: transaction?.recipient_account_id ?? undefined,
        amount: transaction?.amount ?? undefined,
        transaction_type: transaction?.transaction_type ?? "expense",
        description: transaction?.description ?? undefined,
        executed_at: formatISODate(transaction?.executed_at ?? new Date().toISOString()),
        budget_item_id: transaction?.budget_item?.id ?? undefined,
    };

    const handleSubmit: SubmitHandler<CreateTransactionData> = async (data: CreateTransactionData) => {
        setError(null);
        try {
            await onSubmit(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while saving');
            throw err;
        }
    };

    if (!accounts.length || !transactionTypes.length || isBudgetItemsLoading) {
        return <Spinner />;
    }

    // Define form fields with conditional visibility
    const formFields: FormField<CreateTransactionData>[] = [
        {
            name: 'transaction_type',
            label: 'Transaction Type',
            type: 'radio',
            options: transactionTypeOptions,
            required: true,
            validation: {
                required: 'Transaction type is required'
            }
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            placeholder: 'Enter transaction description',
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
            name: 'budget_item_id',
            label: 'Budget Item',
            type: 'select',
            options: budgetItemOptions
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
                defaultValues={defaultValues}
            />

            <FormActions
                isSubmitting={isSubmitting}
                onCancel={onCancel}
                formId={FORM_ID}
                isEditing={!!transaction?.id}
            />
        </div>
    );
} 