import { Eye, Undo2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
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
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    const toggleCard = (id: string) => {
        setExpandedCardId(expandedCardId === id ? null : id);
    };

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

    // Mobile card view
    const renderMobileCards = () => (
        <div className="space-y-4 md:hidden">
            {transactions.map((transaction) => (
                <div
                    key={transaction.id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                >
                    <button
                        className="w-full p-4 flex justify-between items-center text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => toggleCard(transaction.id)}
                        aria-expanded={expandedCardId === transaction.id}
                        aria-controls={`transaction-details-${transaction.id}`}
                    >
                        <div className="flex-grow">
                            <div className="font-medium text-gray-900 truncate">{transaction.description}</div>
                            <div className="text-sm text-gray-500">{formatDate(transaction.executed_at)}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`text-${transactionTypeColor(transaction.transaction_type)}-600 font-medium`}>
                                {formatCurrency(transaction.amount)}
                            </span>
                            {expandedCardId === transaction.id ?
                                <ChevronUp className="h-4 w-4 text-gray-500" /> :
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            }
                        </div>
                    </button>

                    {expandedCardId === transaction.id && (
                        <div
                            id={`transaction-details-${transaction.id}`}
                            className="px-4 pb-4 pt-2 border-t border-gray-100"
                        >
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="text-gray-500">Type</div>
                                <div>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${transactionTypeColor(transaction.transaction_type)}-100 text-${transactionTypeColor(transaction.transaction_type)}-800`}>
                                        {transaction.transaction_type}
                                    </span>
                                </div>

                                <div className="text-gray-500">Frequency</div>
                                <div>
                                    {transaction.frequency === 'one_time' ? (
                                        <span className="text-gray-500">One Time</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                            {transaction.frequency}
                                        </span>
                                    )}
                                </div>

                                <div className="text-gray-500">Account</div>
                                <div className="text-gray-700">
                                    {transaction.account?.name}
                                    {transaction.recipient_account?.name && (
                                        <span> → {transaction.recipient_account?.name}</span>
                                    )}
                                </div>

                                <div className="text-gray-500">Category</div>
                                <div className="text-gray-700">{transaction.category || '-'}</div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpen(transaction.id);
                                    }}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(transaction.id);
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    // Desktop table view
    const renderDesktopTable = () => (
        <div className="hidden md:block mt-4 bg-white rounded-lg overflow-hidden shadow">
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

    return (
        <>
            {renderMobileCards()}
            {renderDesktopTable()}
        </>
    );
} 