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

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

    const handleOpenEditModal = (id: string) => {
        const transaction = transactions.find((t) => t.id === id);
        if (transaction) {
            setEditingTransaction(transaction);
        }
    };

    const handleDeleteTransaction = (id: string) => {
        ui.confirm({
            title: "Delete Transaction",
            message: "Are you sure you want to delete this transaction? This action cannot be undone.",
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
                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                >
                    Create Transaction
                </button>
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
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteTransaction}
                />
            </div>

            <TransactionModal
                isOpen={isCreateModalOpen || editingTransaction !== undefined}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingTransaction(undefined);
                }}
                accounts={accounts}
                transactionTypes={transactionTypes}
                initialData={editingTransaction}
                isSubmitting={isSubmitting}
                title={editingTransaction ? "Edit Transaction" : "Create Transaction"}
            />
        </Layout>
    );
} 