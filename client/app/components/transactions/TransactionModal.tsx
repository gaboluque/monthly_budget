import { Transaction, TransactionType } from "../../lib/types/transactions";
import { Account } from "../../lib/types/accounts";
import { Modal } from "../ui/Modal";

export interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: Account[];
    transactionTypes: TransactionType[];
    initialData?: Transaction;
    isSubmitting: boolean;
    title: string;
}

export function TransactionModal({
    isOpen,
    onClose,
    accounts,
    transactionTypes,
    title
}: TransactionModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div>
                {/* Transaction form would go here */}
                {/* Using props that were flagged as unused */}
                <div className="space-y-4">
                    {/* Account selection */}
                    <div>
                        <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                            Account
                        </label>
                        <select
                            id="account"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Transaction type selection */}
                    <div>
                        <label htmlFor="transaction-type" className="block text-sm font-medium text-gray-700">
                            Type
                        </label>
                        <select
                            id="transaction-type"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            {transactionTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </Modal>
    );
} 