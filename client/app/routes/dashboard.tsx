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
    paidBudgetItems,
    pendingIncomes,
    isLoading,
    markingBudgetItemPaid,
    markingIncomeReceived,
    summaryData,
    handleMarkBudgetItemAsPaid,
    handleMarkIncomeAsPending,
    handleMarkBudgetItemAsPending,
    handleMarkIncomeAsReceived,
  } = useDashboard()

  return (
    <Layout>
      <PageHeader title="Dashboard" description="Your Monthly Budget Dashboard" buttonText="Add Transaction" />
      <FinancialSummary summaryData={summaryData} />

      {pendingIncomes.length > 0 && (
        <IncomesList
          incomes={pendingIncomes}
          isLoading={isLoading}
          markingReceived={markingIncomeReceived}
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

      <BudgetItemList
        budgetItems={[...pendingBudgetItems, ...paidBudgetItems]}
        isLoading={isLoading}
        markingBudgetItemPaid={markingBudgetItemPaid}
        onAction={(id: string) => {
          const isPaid = paidBudgetItems.some((e) => e.id === id)
          if (isPaid) {
            handleMarkBudgetItemAsPending(id)
          } else {
            handleMarkBudgetItemAsPaid(id)
          }
        }}
      />
    </Layout>
  )
}

