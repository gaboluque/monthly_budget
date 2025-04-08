import { PieChart } from "lucide-react"
import { StatCard } from "../ui/StatCard"

interface BudgetSummaryProps {
  totalBudgets: number
  budgetCount: number
}

export function BudgetSummary({
  totalBudgets,
  budgetCount,
}: BudgetSummaryProps) {


  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
        <PieChart className="w-4 h-4" />
        Budget Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Budget Items"
          amount={totalBudgets}
          description={`${budgetCount} budget items`}
          icon={PieChart}
          variant="blue"
        />
      </div>
    </div>
  )
} 