import { Edit2, Trash2, DollarSign, CheckCircle } from "lucide-react"
import { formatCurrency } from "../../lib/utils/currency"
import type { Income } from "../../lib/types/incomes"
import { formatDate } from "../../lib/utils/formatters"

interface IncomeItemProps {
  income: Income
  onEdit: (income: Income) => void
  onDelete: (id: string) => void
  onReceive: (id: string) => void
}

export function IncomeItem({ income, onEdit, onDelete, onReceive }: IncomeItemProps) {

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-base font-medium text-gray-900 truncate">{income.name}</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-6 pl-12">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(income.amount)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-1">Last Received:</span>
              <span className="text-sm text-gray-700 capitalize">{income.last_received_at ? formatDate(income.last_received_at) : 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-1">To:</span>
              <span className="text-sm text-gray-700 capitalize">{income.account?.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(income)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            aria-label="Edit income"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(income.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Delete income"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onReceive(income.id)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            aria-label="Receive income"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 