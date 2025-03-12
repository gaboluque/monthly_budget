import { PieChart, CreditCard } from "lucide-react"
import { formatCurrency } from "../../utils/currency"

interface ExpenseSummaryProps {
  totalExpenses: number
  expenseCount: number
  categoryCount: number
}

export function ExpenseSummary({ totalExpenses, expenseCount, categoryCount }: ExpenseSummaryProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
        <PieChart className="w-4 h-4" />
        Expense Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-blue-700">Total Expenses</h4>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-blue-600 mt-1">
            {expenseCount} expenses across {categoryCount} categories
          </p>
        </div>
      </div>
    </div>
  )
} 