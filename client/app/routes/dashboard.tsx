import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/ui/Layout"
import { useDashboard } from "../hooks/useDashboard"
import { IncomesList } from "../components/dashboard/IncomesList"
import { ui } from "../lib/ui"
import { PageHeader } from "../components/ui/PageHeader"

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Monthly Budget" }, { name: "description", content: "Your Monthly Budget Dashboard" }]
}

export default function Dashboard() {
  const {
    pendingIncomes,
    markingIncomeReceived,
    handleMarkIncomeAsReceived,
    incomesLoading,
  } = useDashboard()

  return (
    <Layout>
      <PageHeader title="Dashboard" description="Your Monthly Budget Dashboard" buttonText="Add Transaction" />

      <IncomesList
        incomes={pendingIncomes}
        isLoading={incomesLoading}
        markingReceived={markingIncomeReceived}
        onAction={(id: string) => {
          ui.confirm({
            title: "Mark as received",
            message: "Are you sure you have received this income?",
            onConfirm: () => handleMarkIncomeAsReceived(id)
          })
        }}
      />
    </Layout>
  )
}
