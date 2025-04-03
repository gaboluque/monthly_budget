import { PieChart } from "lucide-react"
import { StatCard } from "../ui/StatCard"
import type { BudgetItemsByCategory } from "../../lib/types/budget_items"
import { CategoryDistribution } from "../CategoryDistribution"

interface BudgetSummaryProps {
  totalBudgetItems: number
  budgetItemCount: number
  budgetItemsByCategory: BudgetItemsByCategory
}

export function BudgetSummary({
  totalBudgetItems,
  budgetItemCount,
  budgetItemsByCategory
}: BudgetSummaryProps) {
  const categoryTotals = Object.fromEntries(
    Object.entries(budgetItemsByCategory).map(([category, budgetItems]) => [
      category,
      budgetItems.reduce((sum, budgetItem) => sum + Number(budgetItem.amount), 0)
    ])
  )

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
        <PieChart className="w-4 h-4" />
        Budget Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Budget Items"
          amount={totalBudgetItems}
          description={`${budgetItemCount} budget items`}
          icon={PieChart}
          variant="blue"
        />
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Category Distribution</h4>
          <CategoryDistribution categories={categoryTotals} total={totalBudgetItems} />
        </div>
      </div>
    </div>
  )
} 