import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/Layout"
import { FinancialSummary } from "../components/dashboard/FinancialSummary"
import { ExpensesList } from "../components/dashboard/ExpensesList"
import { useDashboard } from "../hooks/useDashboard"

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Monthly Budget" }, { name: "description", content: "Your Monthly Budget Dashboard" }]
}

export default function Dashboard() {
  const {
    pendingExpenses,
    expensedExpenses,
    isLoading,
    markingExpensed,
    summaryData,
    handleMarkAsExpensed,
    handleUnmarkAsExpensed,
  } = useDashboard()

  return (
    <Layout>
      {/* Financial Summary Section */}
      <FinancialSummary summaryData={summaryData} />

      {/* Expenses List Section */}
      <ExpensesList
        pendingExpenses={pendingExpenses}
        expensedExpenses={expensedExpenses}
        isLoading={isLoading}
        markingExpensed={markingExpensed}
        handleMarkAsExpensed={handleMarkAsExpensed}
        handleUnmarkAsExpensed={handleUnmarkAsExpensed}
      />
    </Layout>
  )
}

