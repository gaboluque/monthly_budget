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

export default function Budgets() {
  const [selectedBudget, setSelectedBudget] = useState<Budget | CreateBudgetData | null>(null)
  const { budgets, createBudget, updateBudget, deleteBudget, isLoading: isBudgetsLoading, natures } = useBudgets()


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
    console.log("id", id)
    const budget = budgets.find(e => e.id === id)
    console.log("budget", budget)
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

      <BudgetSummary
        budgets={budgets}
        isLoading={isBudgetsLoading}
      />

      <div className="mt-6 bg-white shadow-sm-xs rounded-lg divide-y divide-gray-200">
        {isBudgetsLoading ? (
          <div className="p-6 text-center text-gray-500">
            <Spinner />
          </div>
        ) : budgets.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No budgets found. Get started by adding your first budget.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 grid grid-cols-1 gap-6">
            {budgets.map((budget) => (
              <li key={budget.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 shadow-sm-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{budget.name}</h3>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full text-${NATURE_COLORS[budget.nature || 'other']}-600`}>{budget.nature}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-semibold text-gray-900">
                      {formatCurrency(budget.amount)}
                    </span>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="mr-2 text-blue-600 hover:text-blue-900"
                        onClick={() => setSelectedBudget(budget)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={!!selectedBudget}
        onClose={() => { setSelectedBudget(null) }}
        title={selectedBudget?.id ? "Edit Budget" : "Add Budget"}
      >
        <BudgetForm
          natures={natures}
          initialData={selectedBudget}
          onSubmit={handleSubmit}
          onCancel={() => {
            setSelectedBudget(null)
          }}
        />
      </Modal>
    </Layout>
  )
}
