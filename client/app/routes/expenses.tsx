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
import { Loader2, AlertCircle, PlusCircle } from "lucide-react"
import { ui } from "../lib/ui"

export const meta: MetaFunction = () => {
  return [{ title: "Expenses | Monthly Budget" }, { name: "description", content: "Manage your monthly expenses" }]
}

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const { expenses, categories, error, isLoading, totalExpenses, expensesByCategory, createExpense, updateExpense, deleteExpense } = useExpenses()

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
      if (selectedExpense?.id) {
        await updateExpense(selectedExpense.id, data)
        setIsModalOpen(false)
        setSelectedExpense(null)
      } else {
        await createExpense(data)
        // Don't close the modal if we're creating another
        if (!isModalOpen) {
          setIsModalOpen(false)
          setSelectedExpense(null)
        }
      }
    } catch (error) {
      console.error("Failed to save expense:", error)
    }
  }

  const handleCreateAnother = () => {
    // Reset the form with a new empty expense
    setSelectedExpense({
      id: "",
      name: "",
      amount: 0,
      category: "",
      destination: "",
      frequency: "monthly",
      created_at: "",
      updated_at: "",
    })
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleAddExpense = (category?: string) => {
    setSelectedExpense({
      id: "",
      name: "",
      amount: 0,
      category: category || "",
      destination: "",
      frequency: "monthly",
      created_at: "",
      updated_at: "",
    })
    setIsModalOpen(true)
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
      }
    })
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
        <ExpenseHeader onAddExpense={() => handleAddExpense()} />

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

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
                onEditExpense={(expense) => {
                  setSelectedExpense(expense)
                  setIsModalOpen(true)
                }}
                onDeleteExpense={handleDeleteExpense}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedExpense(null)
        }}
        title={selectedExpense?.id ? "Edit Expense" : "Add Expense"}
      >
        <ExpenseForm
          initialData={selectedExpense ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedExpense(null)
          }}
          onCreateAnother={handleCreateAnother}
        />
      </Modal>
    </Layout>
  )
}
