import { Loader2, Check, Calendar, ArrowUpDown, ChevronDown, ChevronUp, Filter } from "lucide-react"
import type { Expense } from "../../lib/types/expenses"
import { ExpenseItem } from "./ExpenseItem"

type SortField = "category" | "amount"
type SortDirection = "asc" | "desc"

interface ExpensesListProps {
  expenses: Expense[]
  isLoading: boolean
  markingExpensed: string | null
  sortField: SortField
  sortDirection: SortDirection
  showSortOptions: boolean
  setShowSortOptions: (show: boolean) => void
  onAction: (id: string) => Promise<void>
  handleSortChange: (field: SortField) => void
  getSortDescription: () => string
  isPending: boolean
}

export function ExpensesList({
  expenses,
  isLoading,
  markingExpensed,
  sortField,
  sortDirection,
  showSortOptions,
  setShowSortOptions,
  onAction,
  handleSortChange,
  getSortDescription,
  isPending,
}: ExpensesListProps) {
  return (
    <div>
      <div className="flex flex-col mb-6 pb-6 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className={`w-5 h-5 ${isPending ? "text-blue-500" : "text-green-500"}`} />
            {isPending ? "Pending Expenses" : "Expensed Items"}
          </h2>

          {/* Mobile Sort Button */}
          {!isLoading && expenses.length > 0 && (
            <div className="md:hidden">
              <button
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
              >
                <Filter className="w-4 h-4" />
                <span className="sr-only md:not-sr-only">Sort</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {isPending ? "Expenses that need to be marked as paid" : "Expenses that have been marked as paid"}
        </p>

        {/* Mobile Sort Options - Collapsible */}
        {!isLoading && expenses.length > 0 && showSortOptions && (
          <div className="md:hidden mt-3 p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium text-gray-700 mb-2">Sort by:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSortChange("category")}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
                  sortField === "category"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                Category
                {sortField === "category" &&
                  (sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </button>
              <button
                onClick={() => handleSortChange("amount")}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
                  sortField === "amount"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                Amount
                {sortField === "amount" &&
                  (sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">Currently sorted by: {getSortDescription()}</div>
          </div>
        )}

        {/* Desktop Sort Controls */}
        {!isLoading && expenses.length > 0 && (
          <div className="hidden md:flex items-center gap-3 mt-3">
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

      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading {isPending ? "pending expenses" : "expensed items"}...</span>
        </div>
      ) : expenses.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Check className={`w-8 h-8 ${isPending ? "text-green-500" : "text-gray-400"}`} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {isPending ? "All caught up!" : "No expensed items"}
          </h3>
          <p className="text-gray-500">
            {isPending ? "No pending expenses to show" : "You haven't marked any expenses as paid yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              isMarking={markingExpensed === expense.id}
              isPending={isPending}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  )
} 