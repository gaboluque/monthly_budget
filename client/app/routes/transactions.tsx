import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";

import { Layout } from "../components/ui/Layout";
import { TransactionsList } from "../components/transactions/TransactionsList";
import { TransactionModal } from "../components/transactions/TransactionModal";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { useTransactions } from "../hooks/useTransactions";
import { Transaction } from "../lib/types/transactions";
import { CreateTransactionData } from "../lib/api/transactions";
import { PageHeader } from "../components/ui/PageHeader";
import { ui } from "../lib/ui";

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

    // Check for 'new=true' in URL and open modal if present
    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            handleNewTransaction();
        }
    }, [searchParams]);

    const handleOpenModal = (transaction: Transaction) => {
        setTransaction(transaction);
    };

    const handleNewTransaction = () => {
        setTransaction({} as Transaction);
    };

    const handleCreateTransaction = async (data: CreateTransactionData) => {
        await createTransaction(data);
    };

    const handleDeleteTransaction = (id: string) => {
        ui.confirm({
            title: "Rollback Transaction",
            message: "Are you sure you want to rollback this transaction?",
            onConfirm: async () => {
                await deleteTransaction(id);
                handleCloseModal();
            },
        });
    };

    const handleCloseModal = () => {
        setTransaction(undefined);
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
                />
            </div>

            <TransactionModal
                isOpen={!!transaction}
                onClose={handleCloseModal}
                accounts={accounts}
                transactionTypes={transactionTypes}
                frequencies={frequencies}
                categories={categories}
                transaction={transaction}
                isSubmitting={isSubmitting}
                title="Transaction"
                onSubmit={handleCreateTransaction}
                onDelete={handleDeleteTransaction}
            />
        </Layout>
    );
} 