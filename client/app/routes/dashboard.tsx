import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/ui/Layout"
import { FinancialSummary } from "../components/dashboard/FinancialSummary"
import { ExpensesList } from "../components/dashboard/ExpensesList"
import { useDashboard } from "../hooks/useDashboard"
import { IncomesList } from "../components/dashboard/IncomesList"
import { ui } from "../lib/ui"

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Monthly Budget" }, { name: "description", content: "Your Monthly Budget Dashboard" }]
}

export default function Dashboard() {
  const {
    pendingExpenses,
    expensedExpenses,
    pendingIncomes,
    isLoading,
    markingExpensed,
    markingReceived,
    summaryData,
    handleMarkExpenseAsPending,
    handleMarkIncomeAsPending,
    handleMarkExpenseAsExpensed,
    handleMarkIncomeAsReceived,
  } = useDashboard()

  return (
    <Layout>
      <FinancialSummary summaryData={summaryData} />

      {pendingIncomes.length > 0 && (
        <IncomesList
          incomes={pendingIncomes}
          isLoading={isLoading}
          markingReceived={markingReceived}
          onAction={(id: string) => {
            const income = pendingIncomes.find((i) => i.id === id)
            if (income?.last_received_at) {
              handleMarkIncomeAsPending(id)
            } else {
              ui.confirm({
                title: "Mark as received",
                message: "Are you sure you have received this income?",
                onConfirm: () => handleMarkIncomeAsReceived(id)
              })
            }
          }}
        />
      )}

      <br />

      <ExpensesList
        expenses={[...pendingExpenses, ...expensedExpenses]}
        isLoading={isLoading}
        markingExpensed={markingExpensed}
        onAction={(id: string) => {
          const isExpensed = expensedExpenses.some((e) => e.id === id)
          if (isExpensed) {
            handleMarkExpenseAsPending(id)
          } else {
            handleMarkExpenseAsExpensed(id)
          }
        }}
      />
    </Layout>
  )
}

