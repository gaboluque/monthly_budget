"use client"

import { useEffect, useMemo, useState } from "react"
import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/Layout"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"
import { ExpenseForm } from "../components/ExpenseForm"
import { expensesApi, type Expense, type CreateExpenseData } from "../lib/api/expenses"
import { formatCurrency } from "../utils/currency"
import {
  PlusCircle,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  PieChart,
} from "lucide-react"

export const meta: MetaFunction = () => {
  return [{ title: "Expenses | Monthly Budget" }, { name: "description", content: "Manage your monthly expenses" }]
}

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchExpenses()
    fetchCategories()
  }, [])

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

  const totalExpenses = useMemo(() => {
    if (expenses.length === 0) return 0
    return expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)
  }, [expenses])

  const fetchExpenses = async () => {
    try {
      const data = await expensesApi.getAll()
      setExpenses(data)
    } catch (error) {
      setError("Failed to fetch expenses")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await expensesApi.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleSubmit = async (data: CreateExpenseData) => {
    try {
      if (selectedExpense?.id) {
        await expensesApi.update(selectedExpense.id, data)
      } else {
        await expensesApi.create(data)
      }
      await fetchExpenses()
      setIsModalOpen(false)
      setSelectedExpense(null)
    } catch (error) {
      setError("Failed to save expense")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await expensesApi.delete(id)
      await fetchExpenses()
    } catch (error) {
      setError("Failed to delete expense")
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Group expenses by category
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = []
      }
      acc[expense.category].push(expense)
      return acc
    },
    {} as Record<string, Expense[]>,
  )

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
        {/* Header with add button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b pb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-bold text-gray-900">Monthly Expenses</h2>
            <p className="mt-1 text-sm text-gray-600">A list of all your expenses organized by category.</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              onClick={() => {
                setSelectedExpense(null)
                setIsModalOpen(true)
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {!isLoading && expenses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Expense Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-blue-700">Total Expenses</h4>
                  <CreditCard className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-2">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {expenses.length} expenses across {categories.length} categories
                </p>
              </div>
            </div>
          </div>
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
            <Button
              onClick={() => {
                setSelectedExpense(null)
                setIsModalOpen(true)
              }}
              className="inline-flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </Button>
          </div>
        ) : (
          /* Expenses list grouped by category */
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryExpenses = expensesByCategory[category] || []
              const totalAmount = categoryExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
              const isExpanded = expandedCategories[category]

              return (
                <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <button onClick={() => toggleCategory(category)} className="flex items-center gap-2 text-left w-full">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {formatCurrency(totalAmount)}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedExpense({
                          id: "",
                          name: "",
                          amount: 0,
                          category: category,
                          destination: "",
                          frequency: "monthly",
                          created_at: "",
                          updated_at: "",
                        })
                        setIsModalOpen(true)
                      }}
                      className="ml-4 flex-shrink-0 p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      aria-label={`Add expense to ${category}`}
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="grid gap-3">
                        {categoryExpenses.length === 0 ? (
                          <button
                            onClick={() => {
                              setSelectedExpense({
                                id: "",
                                name: "Other",
                                amount: 0,
                                category: category,
                                destination: "",
                                frequency: "monthly",
                                created_at: "",
                                updated_at: "",
                              })
                              setIsModalOpen(true)
                            }}
                            className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
                          >
                            <p className="text-sm text-gray-500">No expenses in this category.</p>
                            <p className="text-sm text-blue-600 mt-1">Click to add one</p>
                          </button>
                        ) : (
                          categoryExpenses.map((expense) => (
                            <div
                              key={expense.id}
                              className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-base font-medium text-gray-900 truncate">{expense.name}</h4>
                                  <div className="mt-2 flex flex-wrap gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(expense.amount)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-xs text-gray-500 mr-1">Frequency:</span>
                                      <span className="text-sm text-gray-700 capitalize">{expense.frequency}</span>
                                    </div>
                                    {expense.destination && (
                                      <div className="flex items-center">
                                        <span className="text-xs text-gray-500 mr-1">To:</span>
                                        <span className="text-sm text-gray-700">{expense.destination}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedExpense(expense)
                                      setIsModalOpen(true)
                                    }}
                                    className="p-2 text-blue-600 bg-blue-50 rounded-md transition-colors"
                                    aria-label="Edit expense"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(expense.id)}
                                    className="p-2 text-red-600 bg-red-50 rounded-md transition-colors"
                                    aria-label="Delete expense"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
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
        />
      </Modal>
    </Layout>
  )
}
