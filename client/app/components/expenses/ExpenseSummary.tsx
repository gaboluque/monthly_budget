import { PieChart, CreditCard } from "lucide-react"
import { StatCard } from "../StatCard"
import type { ExpensesByCategory } from "../../lib/types/expenses"
import { CategoryDistribution } from "../CategoryDistribution"

interface ExpenseSummaryProps {
  totalExpenses: number
  expenseCount: number
  expensesByCategory: ExpensesByCategory
}

export function ExpenseSummary({ 
  totalExpenses, 
  expenseCount, 
  expensesByCategory 
}: ExpenseSummaryProps) {
  const categoryTotals = Object.fromEntries(
    Object.entries(expensesByCategory).map(([category, expenses]) => [
      category,
      expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    ])
  )

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
        <PieChart className="w-4 h-4" />
        Expense Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Expenses"
          amount={totalExpenses}
          description={`${expenseCount} expenses`}
          icon={PieChart}
          iconSecondary={CreditCard}
          variant="blue"
        />
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Category Distribution</h4>
          <CategoryDistribution categories={categoryTotals} total={totalExpenses} />
        </div>
      </div>
    </div>
  )
} 