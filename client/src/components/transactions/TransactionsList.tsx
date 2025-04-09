import { Transaction } from "../../lib/types/transactions";
import { formatDate, formatTransaction } from "../../lib/utils/formatters";
import { Spinner } from "../ui/Spinner";
import { ListCard } from "../ui/ListCard";
import { transactionTypeColor } from "../../lib/ui/colorHelpers";
interface TransactionsListProps {
    transactions: Transaction[];
    isLoading: boolean;
    onOpen: (transaction: Transaction) => void;
}

export function TransactionsList({ transactions, isLoading, onOpen }: TransactionsListProps) {

    if (isLoading) {
        return (
            <Spinner />
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
        <div className="grid gap-2">
            {transactions.map((transaction) => (
                <ListCard
                    onClick={() => onOpen(transaction)}
                    key={transaction.id}
                    icon={transaction.category?.icon}
                    title={transaction.description || transaction.category?.name}
                    description={(
                        <div className="text-xs text-gray-500">{transaction.category?.name} - {formatDate(transaction.executed_at)}</div>
                    )}
                    amount={(
                        <div className={`text-${transactionTypeColor(transaction.transaction_type)}-600 font-medium`}>
                            {formatTransaction(transaction)}
                        </div>
                    )}
                />
            ))}
        </div>
    );
} 