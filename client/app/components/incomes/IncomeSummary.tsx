import { BarChart2, TrendingUp } from "lucide-react"
import { formatCurrency } from "../../utils/currency"

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
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-green-700">Total Income</h4>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-green-600 mt-1">{incomeCount} income sources</p>
        </div>
      </div>
    </div>
  )
} 