import { Eye, Undo2 } from "lucide-react";
import { Transaction } from "../../lib/types/transactions";
import { formatCurrency, formatDate } from "../../lib/utils/formatters";
import { Button } from "../ui/Button";
import { transactionTypeColor } from "../../lib/ui/colorHelpers";
interface TransactionsListProps {
    transactions: Transaction[];
    isLoading: boolean;
    onOpen: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TransactionsList({ transactions, isLoading, onOpen, onDelete }: TransactionsListProps) {
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
        <div className="mt-4 bg-white rounded-lg overflow-hidden shadow">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Frequency
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Account
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(transaction.executed_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {transaction.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${transactionTypeColor(transaction.transaction_type)}-100 text-${transactionTypeColor(transaction.transaction_type)}-800`}>
                                        {transaction.transaction_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.frequency === 'one_time' ? (
                                        <span className="text-gray-500">One Time</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                            {transaction.frequency}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.account?.name}
                                    {transaction.recipient_account?.name && (
                                        <span> → {transaction.recipient_account?.name}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span className={`text-${transactionTypeColor(transaction.transaction_type)}-600`}>
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onOpen(transaction.id)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(transaction.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Undo2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 