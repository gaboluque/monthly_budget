import { CreditCard, Check, Undo, Loader2 } from "lucide-react"
import { Button } from "../ui/Button"
import { formatCurrency } from "../../lib/utils/currency"
import type { BudgetItem } from "../../lib/types/budget_items"
import { CATEGORY_COLORS } from "../../lib/types/budget_items"
import { useAccounts } from "../../hooks/useAccounts"
import { useMemo } from "react"

interface BudgetItemItemProps {
  budgetItem: BudgetItem
  isMarking: boolean
  onAction: (id: string) => void
}

export function BudgetItemItem({ budgetItem, isMarking, onAction }: BudgetItemItemProps) {
  const { accounts } = useAccounts();
  const accountName = accounts.find((account) => account.id === budgetItem.account_id)?.name;

  const isPending = useMemo(() => {
    if (!budgetItem.last_paid_at) return true;

    // If last paid at is not on this month, it's pending
    const lastPaidAt = new Date(budgetItem.last_paid_at);

    return lastPaidAt.getMonth() !== new Date().getMonth()
  }, [budgetItem.last_paid_at])

  const iconBgColor = isPending ? "bg-blue-100" : "bg-green-100"
  const iconColor = isPending ? "text-blue-600" : "text-green-600"
  const buttonBgColor = isPending ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
  const ActionIcon = isPending ? Check : Undo
  const actionText = isPending ? "Mark as Paid" : "Mark as Pending"
  const categoryColor = CATEGORY_COLORS[budgetItem.category] || "#6b7280"

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex-shrink-0 w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <CreditCard className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">{budgetItem.name}</h3>
            <div className="flex items-center mt-1">
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
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(budgetItem.amount)}</p>
            <p className="text-xs text-gray-500 capitalize">{budgetItem.frequency}</p>
          </div>
          {budgetItem.account_id && <div className="text-xs text-gray-500">Account: {accountName}</div>}
        </div>

        <Button
          onClick={() => onAction(budgetItem.id)}
          disabled={isMarking}
          className={`w-full flex items-center justify-center gap-2 ${buttonBgColor} text-white py-2.5 rounded-lg transition-colors`}
        >
          {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ActionIcon className="w-4 h-4" />}
          <span>{actionText}</span>
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
              <CreditCard className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">{budgetItem.name}</h3>
              <div className="flex items-center mt-1 gap-4">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full w-24 text-center"
                  style={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor
                  }}
                >
                  {budgetItem.category}
                </span>
                {budgetItem.account_id && (
                  <span className="text-xs text-gray-500">Account: {accountName}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(budgetItem.amount)}</p>
            <p className="text-xs text-gray-500 capitalize">{budgetItem.frequency}</p>
          </div>
          <Button
            onClick={() => onAction(budgetItem.id)}
            disabled={isMarking}
            className={`flex items-center gap-2 ${buttonBgColor} text-white px-4 py-2 rounded-lg transition-colors`}
          >
            {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ActionIcon className="w-4 h-4" />}
            <span>{actionText}</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 