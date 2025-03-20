import { TrendingUp } from "lucide-react"
import { formatCurrency } from "../../lib/utils/currency"
import { CategoryDistribution } from "../CategoryDistribution"

interface FinancialSummaryProps {
  summaryData: {
    totalIncome: number
    totalBudgetItems: number
    totalPendingBudgetItems: number
    balance: number
    budgetItemCategories: number
    incomeCount: number
    pendingBudgetItemsCount: number
    budgetItemsByCategory: {
      [key: string]: number
    }
  }
}

export function FinancialSummary({ summaryData }: FinancialSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 lg:p-8 mb-6">
      <div className="flex flex-col mb-6 pb-6 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
          <p className="mt-1 text-sm text-gray-600">Your monthly budget at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`rounded-lg p-5 ${summaryData.balance >= 0 ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${summaryData.balance >= 0 ? "text-green-700" : "text-red-700"}`}>
              Remaining Balance
            </h3>
            <TrendingUp className={`w-5 h-5 ${summaryData.balance >= 0 ? "text-green-500" : "text-red-500"}`} />
          </div>
          <p className={`text-2xl font-bold ${summaryData.balance >= 0 ? "text-green-900" : "text-red-900"}`}>
            {formatCurrency(summaryData.balance, false)}
          </p>
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between md:justify-start gap-4">
            <div>
              <p className="text-xs text-gray-500">Income</p>
              <p className="text-sm font-medium text-gray-900">{formatCurrency(summaryData.totalIncome, false)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Budget Items</p>
              <p className="text-sm font-medium text-gray-900">{formatCurrency(summaryData.totalBudgetItems, false)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-sm font-medium text-gray-900">{summaryData.pendingBudgetItemsCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-5 bg-gray-50 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Budget Item Categories</h3>
          <CategoryDistribution
            categories={summaryData.budgetItemsByCategory}
            total={summaryData.totalBudgetItems}
          />
        </div>
      </div>
    </div>
  )
} 