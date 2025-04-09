import { Layout } from "../components/ui/Layout"
import { PageHeader } from "../components/ui/PageHeader"
import { useDashboard } from "../hooks/useDashboard"
import { MonthlyBalanceCard } from "../components/dashboard/MonthlyBalanceCard"
import { Spinner } from "../components/ui/Spinner"
import { useTransactions } from "../hooks/useTransactions"
import { TransactionsList } from "../components/transactions/TransactionsList"
import { useBudgets } from "../hooks/useBudgets";
import { formatCurrency } from "../lib/utils/currency";
import { NATURE_COLORS } from "../lib/types/budgets"

export default function Dashboard() {
  const { monthlyBalance, monthlyBalanceLoading } = useDashboard();
  const { transactions: recentTransactions, isLoading: recentTransactionsLoading } = useTransactions({
    limit: 3,
  });
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { budgets, isLoading: budgetsLoading } = useBudgets();

  // Calculate the amount used for each budget based on the transactions by category
  const budgetsUsage = budgets.reduce((acc, budget) => {
    budget.categories.forEach((category) => {
      transactions.forEach((transaction) => {
        if (transaction.category?.name === category.name) {
          acc[budget.name] = (acc[budget.id] || 0) + transaction.amount;
        }
      });
    });
    return acc;
  }, {} as Record<string, number>);

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
        <div className="space-y-6 md:p-4 lg:p-6 max-w-7xl mx-auto mb-6">
          {/* Monthly Balance Card */}
          <MonthlyBalanceCard
            monthlyBalance={monthlyBalance?.monthly_balance || "0"}
            incomeTotal={monthlyBalance?.incomes?.total || "0"}
            expensesTotal={monthlyBalance?.expenses?.total || "0"}
          />
        </div>
      )}

      {/* Recent Transactions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
          Recent Transactions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TransactionsList transactions={recentTransactions} isLoading={recentTransactionsLoading} onOpen={() => { }} />
        </div>
      </div>

      {/* Budget Overview */}
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
          Budget Overview
        </h3>

        <div className="border border-gray-100 shadow-sm bg-white p-4 rounded-lg">
          {budgetsLoading || transactionsLoading ? (
            <div className="flex justify-center items-center p-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(budgetsUsage).map(([budgetName, usageAmount]) => {
                const budget = budgets.find((b) => b.name === budgetName);
                const budgetAmount = budget?.amount || 0;
                const percentage = budgetAmount > 0 ? (usageAmount / budgetAmount) * 100 : 0
                const natureColor = NATURE_COLORS[budget?.nature.toLowerCase() || "other"] || NATURE_COLORS.other

                return (
                  <div key={budgetName} className="flex items-center gap-2">
                    <div className="w-24 text-sm font-medium" style={{ color: natureColor }}>
                      {budgetName}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage.toFixed(1)}%`,
                            backgroundColor: natureColor
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-24 text-sm text-right">
                      <span className="font-medium" style={{ color: natureColor }}>
                        {formatCurrency(usageAmount || 0)}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
