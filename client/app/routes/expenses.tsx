import { useEffect, useState } from "react"
import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/Layout"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"
import { ExpenseForm } from "../components/expenses/ExpenseForm"
import { ExpenseHeader } from "../components/expenses/ExpenseHeader"
import { ExpenseSummary } from "../components/expenses/ExpenseSummary"
import { ExpenseCategory } from "../components/expenses/ExpenseCategory"
import { useExpenses } from "../hooks/useExpenses"
import type { Expense, CreateExpenseData } from "../lib/types/expenses"
import { Loader2, PlusCircle } from "lucide-react"
import { ui } from "../lib/ui/manager"

export const meta: MetaFunction = () => {
  return [{ title: "Expenses | Monthly Budget" }, { name: "description", content: "Manage your monthly expenses" }]
}

export default function Expenses() {
  const [selectedExpense, setSelectedExpense] = useState<Expense | CreateExpenseData | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const { expenses, categories, isLoading, totalExpenses, expensesByCategory, createExpense, updateExpense, deleteExpense } = useExpenses()

  // Initialize all categories as collapsed when they're loaded
  useEffect(() => {
    if (categories.length > 0) {
      const initialExpandState = categories.reduce(
        (acc, category) => {
          acc[category] = false // Start with all categories collapsed
          return acc
        },
        {} as Record<string, boolean>,
      )
      setExpandedCategories(initialExpandState)
    }
  }, [categories])

  const handleSubmit = async (data: CreateExpenseData) => {
    try {
      let expense: Expense | null = null;
      if (data?.id) {
        expense = await updateExpense(data.id, data);
      } else {
        expense = await createExpense(data);
      }

      if (expense) setSelectedExpense(null);
    } catch (error) {
      ui.notify({
        message: "Failed to save expense",
        type: "error",
      });
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleAddExpense = (category?: string) => {
    setSelectedExpense({
      category: category || undefined,
    })
  }

  const handleDeleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id)
    if (!expense) return

    ui.confirm({
      title: "Delete Expense",
      message: `Are you sure you want to delete "${expense.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmVariant: "danger",
      onConfirm: async () => {
        await deleteExpense(id)
        ui.notify({
          type: "success",
          message: `"${expense.name}" has been deleted successfully`
        })
      }
    })
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
        <ExpenseHeader onAddExpense={() => handleAddExpense()} />

        {/* Summary Cards */}
        {!isLoading && expenses.length > 0 && (
          <ExpenseSummary
            totalExpenses={totalExpenses}
            expenseCount={expenses.length}
            expensesByCategory={expensesByCategory}
          />
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="py-12 flex justify-center items-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading expenses...</span>
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <PlusCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first expense</p>
            <Button onClick={() => handleAddExpense()} className="inline-flex items-center justify-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </Button>
          </div>
        ) : (
          /* Expenses list grouped by category */
          <div className="space-y-4">
            {categories.map((category) => (
              <ExpenseCategory
                key={category}
                category={category}
                expenses={expensesByCategory[category] || []}
                isExpanded={expandedCategories[category]}
                onToggle={toggleCategory}
                onAddExpense={handleAddExpense}
                onEditExpense={setSelectedExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedExpense}
        onClose={() => { setSelectedExpense(null) }}
        title={selectedExpense?.id ? "Edit Expense" : "Add Expense"}
      >
        <ExpenseForm
          initialData={selectedExpense}
          onSubmit={handleSubmit}
          onCancel={() => {
            setSelectedExpense(null)
          }}
        />
      </Modal>
    </Layout>
  )
}
