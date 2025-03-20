import { Edit2, Trash2 } from "lucide-react"
import { formatCurrency } from "../../lib/utils/currency"
import type { BudgetItem } from "../../lib/types/budget_items"
import { useAccounts } from "../../hooks/useAccounts"

interface BudgetItemProps {
  budgetItem: BudgetItem
  onEdit: (budgetItem: BudgetItem) => void
  onDelete: (id: string) => void
}

export function BudgetItem({ budgetItem, onEdit, onDelete }: BudgetItemProps) {
  const { accounts } = useAccounts();
  const accountName = accounts.find(account => account.id === budgetItem.account_id)?.name;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-gray-900 truncate">{budgetItem.name}</h4>
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(budgetItem.amount)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-1">Frequency:</span>
              <span className="text-sm text-gray-700 capitalize">{budgetItem.frequency}</span>
            </div>
            {budgetItem.account_id && (
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">Account:</span>
                <span className="text-sm text-gray-700">{accountName}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(budgetItem)}
            className="p-2 text-blue-600 bg-blue-50 rounded-md transition-colors"
            aria-label="Edit budget item"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budgetItem.id)}
            className="p-2 text-red-600 bg-red-50 rounded-md transition-colors"
            aria-label="Delete budget item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 