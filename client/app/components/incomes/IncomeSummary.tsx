import { BarChart2, TrendingUp } from "lucide-react"
import { StatCard } from "../StatCard"

interface IncomeSummaryProps {
  totalIncome: number
  incomeCount: number
}

export function IncomeSummary({ totalIncome, incomeCount }: IncomeSummaryProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
        <BarChart2 className="w-4 h-4" />
        Income Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          amount={totalIncome}
          description={`${incomeCount} income sources`}
          icon={BarChart2}
          iconSecondary={TrendingUp}
          variant="green"
        />
      </div>
    </div>
  )
} 