import type { Expense } from "../../lib/types/expenses"
import { ExpensesCategoryList } from "./ExpensesCategoryList"

interface ExpensesListContainerProps {
  pendingExpenses: Expense[]
  expensedExpenses: Expense[]
  isLoading: boolean
  markingExpensed: string | null
  sortField: "category" | "amount"
  sortDirection: "asc" | "desc"
  showSortOptions: boolean
  setShowSortOptions: (show: boolean) => void
  handleMarkAsExpensed: (id: string) => Promise<void>
  handleUnmarkAsExpensed: (id: string) => Promise<void>
  handleSortChange: (field: "category" | "amount") => void
  getSortDescription: () => string
}

export function ExpensesList({
  pendingExpenses,
  expensedExpenses,
  isLoading,
  markingExpensed,
  sortField,
  sortDirection,
  showSortOptions,
  setShowSortOptions,
  handleMarkAsExpensed,
  handleUnmarkAsExpensed,
  handleSortChange,
  getSortDescription,
}: ExpensesListContainerProps) {
  const allExpenses = [...pendingExpenses, ...expensedExpenses]

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 lg:p-8">
      <ExpensesCategoryList
        expenses={allExpenses}
        isLoading={isLoading}
        markingExpensed={markingExpensed}
        sortField={sortField}
        sortDirection={sortDirection}
        showSortOptions={showSortOptions}
        setShowSortOptions={setShowSortOptions}
        onAction={(id: string) => {
          const expense = allExpenses.find((e) => e.id === id)
          if (expense?.last_expensed_at) {
            return handleUnmarkAsExpensed(id)
          }
          return handleMarkAsExpensed(id)
        }}
        handleSortChange={handleSortChange}
        getSortDescription={getSortDescription}
        isPending={false}
      />
    </div>
  )
} 