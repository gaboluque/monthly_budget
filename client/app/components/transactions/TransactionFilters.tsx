import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Account } from "../../lib/types/accounts";
import { TransactionType, TransactionsFilterParams } from "../../lib/types/transactions";
import { Filter, X } from "lucide-react";

interface TransactionFiltersProps {
    accounts: Account[];
    transactionTypes: TransactionType[];
    onApplyFilters: (filters: TransactionsFilterParams) => void;
    onClearFilters: () => void;
    currentFilters: TransactionsFilterParams;
}

export function TransactionFilters({
    accounts,
    transactionTypes,
    onApplyFilters,
    onClearFilters,
    currentFilters
}: TransactionFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<TransactionsFilterParams>(currentFilters || {});

    useEffect(() => {
        setFilters(currentFilters || {});
    }, [currentFilters]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value || undefined }));
    };

    const handleApplyFilters = () => {
        onApplyFilters(filters);
    };

    const handleClearFilters = () => {
        setFilters({});
        onClearFilters();
    };

    const hasActiveFilters = Object.values(currentFilters).some(value => value !== undefined && value !== "");

    return (
        <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                        <Filter className="mr-2 h-5 w-5 text-gray-400" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Active
                            </span>
                        )}
                    </h3>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-600"
                    >
                        {isExpanded ? "Hide Filters" : "Show Filters"}
                    </Button>
                </div>

                {isExpanded && (
                    <div className="mt-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">
                                    Account
                                </label>
                                <select
                                    id="account_id"
                                    name="account_id"
                                    value={filters.account_id || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">All Accounts</option>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700">
                                    Transaction Type
                                </label>
                                <select
                                    id="transaction_type"
                                    name="transaction_type"
                                    value={filters.transaction_type || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">All Types</option>
                                    {transactionTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    value={filters.search || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Search description..."
                                />
                            </div>

                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    id="start_date"
                                    value={filters.start_date || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    id="end_date"
                                    value={filters.end_date || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClearFilters}
                                className="mr-3 inline-flex items-center"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                            <Button type="button" variant="primary" onClick={handleApplyFilters}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 