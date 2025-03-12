import { PieChart, CreditCard } from "lucide-react"
import { StatCard } from "../StatCard"

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
        <StatCard
          title="Total Expenses"
          amount={totalExpenses}
          description={`${expenseCount} expenses across ${categoryCount} categories`}
          icon={PieChart}
          iconSecondary={CreditCard}
          variant="blue"
        />
      </div>
    </div>
  )
} 