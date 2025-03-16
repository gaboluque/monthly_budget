import { Edit2, Trash2 } from "lucide-react"
import { formatCurrency } from "../../lib/utils/currency"
import type { Expense } from "../../lib/types/expenses"
import { useExpenseAccounts } from "../../hooks/useExpenseAccounts"

interface ExpenseItemProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const { getAccountName } = useExpenseAccounts();
  const accountName = getAccountName(expense.account_id);
  
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-gray-900 truncate">{expense.name}</h4>
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-1">Frequency:</span>
              <span className="text-sm text-gray-700 capitalize">{expense.frequency}</span>
            </div>
            {expense.account_id && (
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">Account:</span>
                <span className="text-sm text-gray-700">{accountName}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-blue-600 bg-blue-50 rounded-md transition-colors"
            aria-label="Edit expense"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-red-600 bg-red-50 rounded-md transition-colors"
            aria-label="Delete expense"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 