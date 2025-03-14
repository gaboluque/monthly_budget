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
    sortField,
    sortDirection,
    showSortOptions,
    setShowSortOptions,
    handleMarkAsExpensed,
    handleUnmarkAsExpensed,
    handleSortChange,
    getSortDescription,
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
        sortField={sortField}
        sortDirection={sortDirection}
        showSortOptions={showSortOptions}
        setShowSortOptions={setShowSortOptions}
        handleMarkAsExpensed={handleMarkAsExpensed}
        handleUnmarkAsExpensed={handleUnmarkAsExpensed}
        handleSortChange={handleSortChange}
        getSortDescription={getSortDescription}
      />
    </Layout>
  )
}

