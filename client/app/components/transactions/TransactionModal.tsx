import { Modal } from "../ui/Modal"
import type { Transaction } from "../../lib/types/transactions"
import type { Account } from "../../lib/types/accounts"
import { formatCurrency } from "../../lib/utils/formatters"
import { TransactionForm } from "./TransactionForm"
import { CreateTransactionData } from "../../lib/api/transactions"

interface TransactionModalProps {
    isOpen: boolean
    onClose: () => void
    accounts: Account[]
    transactionTypes: string[]
    frequencies: string[]
    transaction: Transaction | undefined
    isSubmitting: boolean
    title: string
    onSubmit?: (data: CreateTransactionData) => Promise<void>
    isNewTransaction?: boolean
}

export function TransactionModal({
    isOpen,
    onClose,
    accounts,
    transactionTypes,
    frequencies,
    transaction,
    isSubmitting,
    title,
    onSubmit,
    isNewTransaction = false,
}: TransactionModalProps) {
    const handleRollback = () => {
        // This would be implemented with actual rollback logic
        console.log("Rolling back transaction:", transaction)
        // After rollback is complete, you might want to close the modal
        onClose()
    }

    // Find the account and transaction type objects based on IDs in initialData
    const account = transaction ? accounts.find((acc) => acc.id === transaction.account_id) : null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="p-4">
                {isNewTransaction ? (
                    // Show the transaction form for creating a new transaction
                    <TransactionForm
                        onSubmit={async (data) => {
                            if (onSubmit) {
                                await onSubmit(data);
                                onClose();
                            }
                        }}
                        onCancel={onClose}
                        accounts={accounts}
                        transactionTypes={transactionTypes}
                        frequencies={frequencies}
                        isSubmitting={isSubmitting}
                    />
                ) : (
                    // Show the transaction details for viewing
                    <div className="space-y-6">
                        {/* Account information */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Account</h3>
                            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                {account ? (
                                    <div>
                                        <p className="font-medium text-gray-900">{account.name}</p>
                                        {account.balance !== undefined && (
                                            <p className="text-sm text-gray-500 mt-1">Balance: {formatCurrency(account.balance)}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No account information available</p>
                                )}
                            </div>
                        </div>

                        {/* Transaction details if available */}
                        {transaction && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Transaction Details</h3>
                                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Amount</p>
                                            <p className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Date</p>
                                            <p className="font-medium text-gray-900">
                                                {transaction.executed_at ? new Date(transaction.executed_at).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Transaction Type</p>
                                            <p className="font-medium text-gray-900">
                                                {transaction.transaction_type}
                                            </p>
                                        </div>
                                        {transaction.description && (
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-500">Description</p>
                                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200">
                            {transaction && (
                                <button
                                    type="button"
                                    onClick={handleRollback}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={isSubmitting}
                                >
                                    Rollback Transaction
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}

