import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";

import { Layout } from "../components/ui/Layout";
import { TransactionsList } from "../components/transactions/TransactionsList";
import { TransactionModal } from "../components/transactions/TransactionModal";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { useTransactions } from "../hooks/useTransactions";
import { ui } from "../lib/ui/manager";
import { Transaction } from "../lib/types/transactions";

export const meta: MetaFunction = () => {
    return [
        { title: "Transactions | Monthly Budget" },
        { name: "description", content: "Manage your transactions" },
    ];
};

export default function Transactions() {
    const {
        transactions,
        accounts,
        transactionTypes,
        isLoading,
        isSubmitting,
        filterParams,
        deleteTransaction,
        applyFilters,
        clearFilters,
    } = useTransactions();

    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);

    const handleOpenModal = (id: string) => {
        const transaction = transactions.find((t) => t.id === id);
        if (transaction) {
            setTransaction(transaction);
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

    return (
        <Layout>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all your transactions across accounts.
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <TransactionFilters
                    accounts={accounts}
                    transactionTypes={transactionTypes}
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
                isOpen={!!transaction}
                onClose={() => setTransaction(undefined)}
                accounts={accounts}
                transaction={transaction}
                isSubmitting={isSubmitting}
                title={"Transaction"}
            />
        </Layout>
    );
} 