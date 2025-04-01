import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/ui/Layout"
import { PageHeader } from "../components/ui/PageHeader"
import { useDashboard } from "../hooks/useDashboard"
import { MonthlyBalanceCard } from "../components/dashboard/MonthlyBalanceCard"
import { BudgetDistributionChart } from "../components/dashboard/BudgetDistributionChart"
import { CategoryCard } from "../components/dashboard/CategoryCard"
import type { CategoryData } from "../lib/types/insights"

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Monthly Budget" }, { name: "description", content: "Your Monthly Budget Dashboard" }]
}

export default function Dashboard() {
  const { monthlyBalance, monthlyBalanceLoading } = useDashboard()

  // Safely get category entries
  const categoryEntries = monthlyBalance?.balance_by_category ? Object.entries(monthlyBalance.balance_by_category) : []

  return (
    <Layout>
      <PageHeader title="Dashboard" description="Your Monthly Budget Dashboard" buttonText="Add Transaction" />

      {monthlyBalanceLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-200 rounded-full mb-4 animate-spin"></div>
            <div className="text-blue-600 font-medium">Loading budget data...</div>
          </div>
        </div>
      ) : !monthlyBalance ? (
        <div className="flex justify-center items-center p-12">
          <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg border border-red-200 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>No budget data available</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
          {/* Monthly Balance Card */}
          <MonthlyBalanceCard
            monthlyBalance={monthlyBalance?.monthly_balance || "0"}
            incomeTotal={monthlyBalance?.incomes?.total || "0"}
            expensesTotal={monthlyBalance?.expenses?.total || "0"}
          />

          {/* Category Distribution Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              Budget Distribution
            </h2>
            <BudgetDistributionChart categories={monthlyBalance?.balance_by_category || {}} />
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryEntries.length > 0 ? (
              categoryEntries.map(([category, data]: [string, CategoryData]) => (
                <CategoryCard key={category} category={category} data={data} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 bg-gray-50 rounded-xl">
                <div className="text-gray-400 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No budget categories found</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Create Your First Category
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
