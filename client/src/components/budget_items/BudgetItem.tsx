import { Edit2, Trash2 } from "lucide-react"
import { formatCurrency } from "../../lib/utils/currency"
import type { BudgetItem } from "../../lib/types/budget_items"

interface BudgetItemProps {
  budgetItem: BudgetItem
  onEdit: (budgetItem: BudgetItem) => void
  onDelete: (id: string) => void
}

export function BudgetItem({ budgetItem, onEdit, onDelete }: BudgetItemProps) {

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-row items-center gap-4">
          <h4 className="text-base font-medium text-gray-900 truncate w-32 truncate md:w-40">{budgetItem.name}</h4>
          <div className="flex flex-wrap gap-4">
            <span className="text-sm font-semibold text-gray-700">
              {formatCurrency(budgetItem.amount)}
            </span>
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