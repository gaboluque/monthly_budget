import { Transaction } from "../../lib/types/transactions";
import { formatCurrency, formatDate } from "../../lib/utils/formatters";
import { transactionTypeColor } from "../../lib/ui/colorHelpers";

interface TransactionsListProps {
    transactions: Transaction[];
    isLoading: boolean;
    onOpen: (transaction: Transaction) => void;
}

export function TransactionsList({ transactions, isLoading, onOpen }: TransactionsListProps) {


    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4 mt-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
                <p className="text-gray-500">No transactions found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-4">
            {transactions.map((transaction) => (
                <div
                    key={transaction.id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                >
                    <button
                        className="w-full p-4 flex justify-between items-center text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => onOpen(transaction)}
                    >
                        <div className="flex-grow flex flex-col gap-1">
                            <div className="font-medium text-gray-900 truncate text-sm">{transaction.description}</div>
                            <div className="text-gray-700 text-sm">
                                {transaction.account?.name}
                                {transaction.recipient_account?.name && (<span> → {transaction.recipient_account?.name}</span>)}
                            </div>
                            <div className="text-xs text-gray-500">{formatDate(transaction.executed_at)}</div>
                        </div>
                        <div className="flex flex-col items-end space-x-3">
                            <span className={`text-${transactionTypeColor(transaction.transaction_type)}-600 font-medium`}>
                                {formatCurrency(transaction.amount)}
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${transactionTypeColor(transaction.transaction_type)}-100 text-${transactionTypeColor(transaction.transaction_type)}-800`}>
                                {transaction.transaction_type}
                            </span>
                        </div>
                    </button>
                </div>
            ))}
        </div>
    );
} 