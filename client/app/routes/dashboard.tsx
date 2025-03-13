"use client"

import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/Layout"
import { useEffect, useState } from "react"
import { expensesApi } from "../lib/api/expenses"
import { incomesApi } from "../lib/api/incomes"
import type { Expense } from "../lib/types/expenses"
import {
  Loader2,
  AlertCircle,
  Check,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Calendar,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "../components/Button"
import { formatCurrency } from "../lib/utils/currency"
import { Link } from "@remix-run/react"

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Monthly Budget" }, { name: "description", content: "Your Monthly Budget Dashboard" }]
}

type SortField = "category" | "amount"
type SortDirection = "asc" | "desc"

export default function Dashboard() {
  const [pendingExpenses, setPendingExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [markingExpensed, setMarkingExpensed] = useState<string | null>(null)
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    expenseCategories: 0,
    incomeCount: 0,
  })
  const [loadingSummary, setLoadingSummary] = useState(true)

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("amount")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const fetchPendingExpenses = async () => {
    try {
      const expenses = await expensesApi.getPending()
      setPendingExpenses(expenses)
    } catch (err) {
      setError("Failed to load pending expenses")
      console.error("Error fetching pending expenses:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSummaryData = async () => {
    try {
      setLoadingSummary(true)
      // Fetch all expenses and incomes to calculate summary data
      const [expenses, incomes] = await Promise.all([expensesApi.getAll(), incomesApi.getAll()])

      const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
      const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0)

      // Get unique categories
      const categories = [...new Set(expenses.map((expense) => expense.category))]

      setSummaryData({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        expenseCategories: categories.length,
        incomeCount: incomes.length,
      })
    } catch (err) {
      console.error("Error fetching summary data:", err)
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    fetchPendingExpenses()
    fetchSummaryData()
  }, [])

  const handleMarkAsExpensed = async (expenseId: string) => {
    try {
      setMarkingExpensed(expenseId)
      await expensesApi.markAsExpensed(expenseId)
      await fetchPendingExpenses() // Refresh the list
      await fetchSummaryData() // Refresh summary data
    } catch (err) {
      setError("Failed to mark expense as expensed")
      console.error("Error marking expense as expensed:", err)
    } finally {
      setMarkingExpensed(null)
    }
  }

  // Handle sort change
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default direction
      setSortField(field)
      setSortDirection(field === "amount" ? "desc" : "asc")
    }
  }

  // Sort expenses based on current sort settings
  const sortedExpenses = [...pendingExpenses].sort((a, b) => {
    if (sortField === "category") {
      const comparison = a.category.localeCompare(b.category)
      return sortDirection === "asc" ? comparison : -comparison
    } else {
      const comparison = Number(a.amount) - Number(b.amount)
      return sortDirection === "asc" ? comparison : -comparison
    }
  })

  return (
    <Layout>
      {/* Financial Summary Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
            <p className="mt-1 text-sm text-gray-600">Your monthly budget at a glance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Link to="/expenses">
              <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                <CreditCard className="w-4 h-4" />
                Expenses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/incomes">
              <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                <DollarSign className="w-4 h-4" />
                Incomes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {loadingSummary ? (
          <div className="py-8 flex justify-center items-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading summary data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`rounded-lg p-5 ${summaryData.balance >= 0 ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${summaryData.balance >= 0 ? "text-green-700" : "text-red-700"}`}>
                  Monthly Balance
                </h3>
                <TrendingUp className={`w-5 h-5 ${summaryData.balance >= 0 ? "text-green-500" : "text-red-500"}`} />
              </div>
              <p className={`text-2xl font-bold ${summaryData.balance >= 0 ? "text-green-900" : "text-red-900"}`}>
                {formatCurrency(summaryData.balance)}
              </p>
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Income</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(summaryData.totalIncome)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expenses</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(summaryData.totalExpenses)}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-700">Expenses</h3>
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(summaryData.totalExpenses)}</p>
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Categories</p>
                  <p className="text-sm font-medium text-gray-900">{summaryData.expenseCategories}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-sm font-medium text-gray-900">{pendingExpenses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-700">Income</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(summaryData.totalIncome)}</p>
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Sources</p>
                  <p className="text-sm font-medium text-gray-900">{summaryData.incomeCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Savings Rate</p>
                  <p className="text-sm font-medium text-gray-900">
                    {summaryData.totalIncome > 0
                      ? `${Math.round((summaryData.balance / summaryData.totalIncome) * 100)}%`
                      : "0%"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pending Expenses Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Pending Expenses
            </h2>
            <p className="mt-1 text-sm text-gray-600">Expenses that need to be marked as paid</p>
          </div>

          {/* Sort Controls */}
          {!isLoading && pendingExpenses.length > 0 && (
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <div className="text-sm text-gray-500 flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-1" />
                Sort by:
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange("category")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
                    sortField === "category"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Category
                  {sortField === "category" &&
                    (sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </button>
                <button
                  onClick={() => handleSortChange("amount")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
                    sortField === "amount" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Amount
                  {sortField === "amount" &&
                    (sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 flex justify-center items-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading pending expenses...</span>
          </div>
        ) : pendingExpenses.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
            <p className="text-gray-500">No pending expenses to show</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedExpenses.map((expense) => (
              <div key={expense.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{expense.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {expense.category}
                          </span>
                          {expense.destination && (
                            <span className="text-xs text-gray-500 ml-2">To: {expense.destination}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-gray-500 capitalize">{expense.frequency}</p>
                    </div>
                    <Button
                      onClick={() => handleMarkAsExpensed(expense.id)}
                      disabled={markingExpensed === expense.id}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {markingExpensed === expense.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Mark as Paid</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

