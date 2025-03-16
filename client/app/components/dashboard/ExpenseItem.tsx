import { CreditCard, Check, Undo, Loader2 } from "lucide-react"
import { Button } from "../Button"
import { formatCurrency } from "../../lib/utils/currency"
import type { Expense } from "../../lib/types/expenses"
import { CATEGORY_COLORS } from "../../lib/types/expenses"
import { useExpenseAccounts } from "../../hooks/useExpenseAccounts"
import { useMemo } from "react"

interface ExpenseItemProps {
  expense: Expense
  isMarking: boolean
  onAction: (id: string) => Promise<void>
}

export function ExpenseItem({ expense, isMarking, onAction }: ExpenseItemProps) {
  const { getAccountName } = useExpenseAccounts();
  const accountName = getAccountName(expense.account_id);

  const isPending = useMemo(() => {
    if (!expense.last_expensed_at) return true;

    // If last expensed at is not on this month, it's pending
    const lastExpensedAt = new Date(expense.last_expensed_at);

    return lastExpensedAt.getMonth() !== new Date().getMonth()
  }, [expense.last_expensed_at])

  const iconBgColor = isPending ? "bg-blue-100" : "bg-green-100"
  const iconColor = isPending ? "text-blue-600" : "text-green-600"
  const buttonBgColor = isPending ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
  const ActionIcon = isPending ? Check : Undo
  const actionText = isPending ? "Mark as Paid" : "Mark as Pending"
  const categoryColor = CATEGORY_COLORS[expense.category] || "#6b7280"

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex-shrink-0 w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <CreditCard className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">{expense.name}</h3>
            <div className="flex items-center mt-1">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full w-24 text-center"
                style={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor
                }}
              >
                {expense.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
            <p className="text-xs text-gray-500 capitalize">{expense.frequency}</p>
          </div>
          {expense.account_id && <div className="text-xs text-gray-500">Account: {accountName}</div>}
        </div>

        <Button
          onClick={() => onAction(expense.id)}
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
              <h3 className="text-base font-medium text-gray-900">{expense.name}</h3>
              <div className="flex items-center mt-1 gap-4">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full w-24 text-center"
                  style={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor
                  }}
                >
                  {expense.category}
                </span>
                {expense.account_id && (
                  <span className="text-xs text-gray-500">Account: {accountName}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
            <p className="text-xs text-gray-500 capitalize">{expense.frequency}</p>
          </div>
          <Button
            onClick={() => onAction(expense.id)}
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