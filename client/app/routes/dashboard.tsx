import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/ui/Layout"
import { FinancialSummary } from "../components/dashboard/FinancialSummary"
import { BudgetItemList } from "../components/dashboard/BudgetItemList"
import { useDashboard } from "../hooks/useDashboard"
import { IncomesList } from "../components/dashboard/IncomesList"
import { ui } from "../lib/ui"
import { PageHeader } from "../components/ui/PageHeader"

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Monthly Budget" }, { name: "description", content: "Your Monthly Budget Dashboard" }]
}

export default function Dashboard() {
  const {
    pendingBudgetItems,
    pendingIncomes,
    isLoading,
    markingBudgetItemPaid,
    markingIncomeReceived,
    summaryData,
    handleMarkBudgetItemAsPaid,
    handleMarkIncomeAsReceived,
  } = useDashboard()

  return (
    <Layout>
      <PageHeader title="Dashboard" description="Your Monthly Budget Dashboard" buttonText="Add Transaction" />
      <FinancialSummary summaryData={summaryData} />

      <IncomesList
        incomes={pendingIncomes}
        isLoading={isLoading}
        markingReceived={markingIncomeReceived}
        onAction={(id: string) => {
          ui.confirm({
            title: "Mark as received",
            message: "Are you sure you have received this income?",
            onConfirm: () => handleMarkIncomeAsReceived(id)
          })
        }}
      />

      <br />

      <BudgetItemList
        budgetItems={pendingBudgetItems}
        isLoading={isLoading}
        markingBudgetItemPaid={markingBudgetItemPaid}
        onAction={(id: string) => {
          ui.confirm({
            title: "Mark as paid",
            message: "Are you sure you have paid this budget item?",
            onConfirm: () => handleMarkBudgetItemAsPaid(id)
          })
        }}
      />
    </Layout>
  )
}

