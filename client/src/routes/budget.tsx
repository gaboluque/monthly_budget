import { useState } from "react"
import { Layout } from "../components/ui/Layout"
import { Modal } from "../components/ui/Modal"
import { BudgetForm } from "../components/budgets/BudgetForm"
import { useBudgets } from "../hooks/useBudgets"
import type { Budget, CreateBudgetData } from "../lib/types/budgets"
import { NATURE_COLORS } from "../lib/types/budgets"
import { ui } from "../lib/ui/manager"
import { PageHeader } from "../components/ui/PageHeader"
import { formatCurrency } from "../lib/utils/currency"
import { Spinner } from "../components/ui/Spinner"
import { BudgetSummary } from "../components/budgets/BudgetSummary"
import { ListCard } from "../components/ui/ListCard"
import { useCategories } from "../hooks/useCategories"

export default function Budgets() {
  const [selectedBudget, setSelectedBudget] = useState<Budget | CreateBudgetData | null>(null)
  const { budgets, createBudget, updateBudget, deleteBudget, isLoading: isBudgetsLoading, natures } = useBudgets()
  const { categories, isLoading: isCategoriesLoading } = useCategories()


  const handleAddBudget = () => {
    setSelectedBudget({
      name: "",
      amount: 0,
      nature: "need",
    })
  }

  const handleSubmit = async (data: CreateBudgetData) => {
    try {
      let budget: Budget | null = null;
      if (data?.id || selectedBudget?.id) {
        const id = data?.id || selectedBudget?.id;
        if (!id) throw new Error("Budget ID is required");

        budget = await updateBudget(id, data);
      } else {
        budget = await createBudget(data);
      }

      if (budget) setSelectedBudget(null);
    } catch (error) {
      ui.notify({
        message: "Failed to save budget",
        type: "error",
        error: error as Error,
      });
    }
  }

  const handleDeleteBudget = (id: string) => {
    const budget = budgets.find(e => e.id === id)
    if (!budget) return

    ui.confirm({
      title: "Delete Budget",
      message: `Are you sure you want to delete "${budget.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmVariant: "danger",
      onConfirm: async () => {
        await deleteBudget(id)
        ui.notify({
          type: "success",
          message: `"${budget.name}" has been deleted successfully`
        })
      }
    })
  }

  return (
    <Layout>
      <PageHeader
        title="Monthly Budget"
        description="A list of all your budgets."
        buttonText="Add Budget"
        buttonColor="blue"
        onAction={() => handleAddBudget()}
      />


      <div className="mt-6 shadow-sm-xs rounded-lg divide-y divide-gray-200">
        {isBudgetsLoading || isCategoriesLoading ? (
          <div className="p-6 text-center text-gray-500">
            <Spinner />
          </div>
        ) : budgets.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No budgets found. Get started by adding your first budget.
          </div>
        ) : (
          <div>
            <BudgetSummary budgets={budgets} />
            <div className="grid gap-2">
              {budgets.map((budget) => (
                <ListCard
                  key={budget.id}
                  icon={<div className={`w-full h-full rounded-full bg-${NATURE_COLORS[budget.nature || 'other']}-500`}></div>}
                  title={budget.name}
                  description={budget.nature}
                  amount={formatCurrency(budget.amount)}
                  onClick={() => setSelectedBudget(budget)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedBudget}
        onClose={() => { setSelectedBudget(null) }}
        title={selectedBudget?.id ? "Edit Budget" : "Add Budget"}
      >
        <BudgetForm
          natures={natures}
          categories={categories}
          initialData={selectedBudget}
          onSubmit={handleSubmit}
          onCancel={() => {
            setSelectedBudget(null)
          }}
          onDelete={() => handleDeleteBudget(selectedBudget?.id || "")}
        />
      </Modal>
    </Layout>
  )
}
