import { Edit2, Trash2 } from "lucide-react"
import { formatCurrency } from "../../lib/utils/currency"
import type { Budget } from "../../lib/types/budgets"

interface BudgetProps {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export function Budget({ budget, onEdit, onDelete }: BudgetProps) {

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-sm-xs transition-shadow-sm">
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-row items-center gap-4">
          <h4 className="text-base font-medium text-gray-900 truncate w-32 truncate md:w-40">{budget.name}</h4>
          <div className="flex flex-wrap gap-4">
            <span className="text-sm font-semibold text-gray-700">
              {formatCurrency(budget.amount)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 text-blue-600 bg-blue-50 rounded-md transition-colors"
            aria-label="Edit budget item"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
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