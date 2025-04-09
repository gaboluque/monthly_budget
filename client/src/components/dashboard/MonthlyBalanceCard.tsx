import { formatCurrency } from "../../lib/utils/currency"
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react"

interface MonthlyBalanceCardProps {
  monthlyBalance: string | number
  incomeTotal: string | number
  expensesTotal: string | number
}

export function MonthlyBalanceCard({
  monthlyBalance = 0,
  incomeTotal = 0,
  expensesTotal = 0,
}: MonthlyBalanceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm-lg p-6 col-span-1 md:col-span-3 border border-blue-100 transition-all duration-300 hover:shadow-sm-xl">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold">Monthly Balance</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-green-600 transition-all duration-500 hover:scale-105 transform">
            {formatCurrency(Number(monthlyBalance))}
          </span>
          <span className="text-xs text-gray-500 mt-1">Available this month</span>
        </div>

        <div className="flex space-x-6 bg-white flex items-center justify-start">
          <div className="flex items-center">
            <div className="mr-2 bg-green-100 p-1.5 rounded-full">
              <ArrowUpCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Income</p>
              <p className="text-lg font-medium text-green-500">
                {formatCurrency(Number(incomeTotal))}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-2 bg-red-100 p-1.5 rounded-full">
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Expenses</p>
              <p className="text-lg font-medium text-red-500">
                {formatCurrency(Number(expensesTotal))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
