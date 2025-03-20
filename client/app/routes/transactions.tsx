import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";

import { Layout } from "../components/ui/Layout";
import { TransactionsList } from "../components/transactions/TransactionsList";
import { TransactionModal } from "../components/transactions/TransactionModal";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { useTransactions } from "../hooks/useTransactions";
import { ui } from "../lib/ui/manager";
import { Transaction } from "../lib/types/transactions";
import { CreateTransactionData } from "../lib/api/transactions";
import { PageHeader } from "../components/ui/PageHeader";

export const meta: MetaFunction = () => {
    return [
        { title: "Transactions | Monthly Budget" },
        { name: "description", content: "Manage your transactions" },
    ];
};

export default function Transactions() {
    const [searchParams] = useSearchParams();
    const {
        transactions,
        accounts,
        transactionTypes,
        frequencies,
        isLoading,
        isSubmitting,
        filterParams,
        createTransaction,
        deleteTransaction,
        applyFilters,
        clearFilters,
        categories,
    } = useTransactions();

    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
    const [isNewTransaction, setIsNewTransaction] = useState(false);

    // Check for 'new=true' in URL and open modal if present
    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            handleNewTransaction();
        }
    }, [searchParams]);

    const handleOpenModal = (id: string) => {
        setIsNewTransaction(false);
        const transaction = transactions.find((t) => t.id === id);
        if (transaction) {
            setTransaction(transaction);
        }
    };

    const handleNewTransaction = () => {
        setIsNewTransaction(true);
        setTransaction(undefined);
        // Remove the 'new' parameter from URL if it exists
        if (searchParams.get('new') === 'true') {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('new');
            window.history.replaceState(null, '',
                `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`
            );
        }
    };

    const handleCreateTransaction = async (data: CreateTransactionData) => {
        try {
            await createTransaction(data);
            setIsNewTransaction(false); // Close the modal
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    const handleDeleteTransaction = (id: string) => {
        ui.confirm({
            title: "Rollback Transaction",
            message: "Are you sure you want to rollback this transaction?",
            onConfirm: async () => {
                try {
                    await deleteTransaction(id);
                } catch (error) {
                    // Error is already handled in the hook
                }
            },
        });
    };

    const handleCloseModal = () => {
        setTransaction(undefined);
        setIsNewTransaction(false);
    };

    return (
        <Layout>
            <PageHeader
                title="Transactions"
                description="A list of all your transactions across accounts."
                buttonText="Add Transaction"
                buttonColor="blue"
                onAction={handleNewTransaction}
            />

            <div className="mt-6">
                <TransactionFilters
                    accounts={accounts}
                    transactionTypes={transactionTypes}
                    frequencies={frequencies}
                    onApplyFilters={applyFilters}
                    onClearFilters={clearFilters}
                    currentFilters={filterParams}
                />

                <TransactionsList
                    transactions={transactions}
                    isLoading={isLoading}
                    onOpen={handleOpenModal}
                    onDelete={handleDeleteTransaction}
                />
            </div>

            <TransactionModal
                isOpen={!!transaction || isNewTransaction}
                onClose={handleCloseModal}
                accounts={accounts}
                transactionTypes={transactionTypes}
                frequencies={frequencies}
                categories={categories}
                transaction={transaction}
                isSubmitting={isSubmitting}
                title={isNewTransaction ? "New Transaction" : "Transaction"}
                onSubmit={handleCreateTransaction}
                isNewTransaction={isNewTransaction}
            />
        </Layout>
    );
} 