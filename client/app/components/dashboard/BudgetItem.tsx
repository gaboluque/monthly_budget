import { CreditCard, Check, Undo, Loader2 } from "lucide-react"
import { Button } from "../ui/Button"
import { formatCurrency } from "../../lib/utils/currency"
import type { BudgetItem } from "../../lib/types/budget_items"
import { CATEGORY_COLORS } from "../../lib/types/budget_items"

interface BudgetItemItemProps {
  budgetItem: BudgetItem
  isMarking: boolean
  onAction: (id: string) => void
}

export function BudgetItemItem({ budgetItem, isMarking, onAction }: BudgetItemItemProps) {

  const iconBgColor = budgetItem.is_pending ? "bg-blue-100" : "bg-green-100"
  const iconColor = budgetItem.is_pending ? "text-blue-600" : "text-green-600"
  const buttonBgColor = budgetItem.is_pending ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
  const ActionIcon = budgetItem.is_pending ? Check : Undo
  const actionText = budgetItem.is_pending ? "Mark as Paid" : "Mark as Pending"
  const categoryColor = CATEGORY_COLORS[budgetItem.category] || "#6b7280"

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 mb-3 md:mb-0">
          <div className={`flex-shrink-0 w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <CreditCard className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-3">
            <h3 className="text-base font-medium text-gray-900">{budgetItem.name}</h3>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full w-24 text-center"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor
              }}
            >
              {budgetItem.category}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between md:justify-end gap-3 md:gap-4">
          <div className="flex flex-row items-center justify-between md:gap-3">
            <div className="md:text-right">
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(budgetItem.amount)}</p>
              <p className="text-xs text-gray-500 capitalize">{budgetItem.frequency}</p>
            </div>
            <div className="md:hidden">
              <p className="text-xs text-gray-500 capitalize">{budgetItem.account?.name}</p>
            </div>
          </div>
          <Button
            onClick={() => onAction(budgetItem.id)}
            disabled={isMarking}
            className={`flex items-center justify-center gap-2 ${buttonBgColor} text-white py-2.5 px-4 rounded-lg transition-colors`}
          >
            {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ActionIcon className="w-4 h-4" />}
            <span>{actionText}</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 