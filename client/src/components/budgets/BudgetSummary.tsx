import { PieChart } from "lucide-react"
import { StatCard } from "../ui/StatCard"
import { NatureDistribution } from "./NatureDistribution"
import { Budget } from "../../lib/types/budgets"
import { Spinner } from "../ui/Spinner"
import { useMemo } from "react"

interface BudgetSummaryProps {
  budgets: Budget[]
  isLoading: boolean
}

export function BudgetSummary({
  budgets,
  isLoading,
}: BudgetSummaryProps) {

  const budgetsByNature = useMemo(() => {
    return budgets.reduce((acc, budget) => {
      acc[budget.nature] = [...(acc[budget.nature] || []), budget]
      return acc
    }, {} as Record<string, Budget[]>)
  }, [budgets])

  const totalBudgetAmount = useMemo(() => {
    return budgets.reduce((acc, budget) => acc + budget.amount, 0)
  }, [budgets])

  if (isLoading) {
    return (
      <div className="mb-8">
        <Spinner />
      </div>
    )
  }


  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
        <PieChart className="w-4 h-4" />
        Budget Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <StatCard
          title="Total Budget Items"
          amount={totalBudgetAmount}
          description={`${budgets.length} budget items`}
          icon={PieChart}
          variant="blue"
        />
      </div>
      <div className="col-span-2 bg-white rounded-lg shadow p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Nature Distribution</h4>
        <NatureDistribution budgetsByNature={budgetsByNature} total={totalBudgetAmount} />
      </div>
    </div>
  )
} 