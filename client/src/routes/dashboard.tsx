import { Layout } from "../components/ui/Layout"
import { PageHeader } from "../components/ui/PageHeader"
import { useDashboard } from "../hooks/useDashboard"
import { MonthlyBalanceCard } from "../components/dashboard/MonthlyBalanceCard"
import { Spinner } from "../components/ui/Spinner"

export default function Dashboard() {
  const { monthlyBalance, monthlyBalanceLoading } = useDashboard()

  return (
    <Layout>
      <PageHeader title="Dashboard" description="Your Monthly Budget Dashboard" />



      {monthlyBalanceLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-pulse flex flex-col items-center">
            <Spinner />
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
        <div className="space-y-6 md:p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Monthly Balance Card */}
          <MonthlyBalanceCard
            monthlyBalance={monthlyBalance?.monthly_balance || "0"}
            incomeTotal={monthlyBalance?.incomes?.total || "0"}
            expensesTotal={monthlyBalance?.expenses?.total || "0"}
          />
        </div>
      )}
    </Layout>
  )
}
