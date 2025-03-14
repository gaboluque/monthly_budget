import type { Expense } from "../../lib/types/expenses"
import { ExpensesCategoryList } from "./ExpensesCategoryList"

interface ExpensesListContainerProps {
  pendingExpenses: Expense[]
  expensedExpenses: Expense[]
  isLoading: boolean
  markingExpensed: string | null
  handleMarkAsExpensed: (id: string) => Promise<void>
  handleUnmarkAsExpensed: (id: string) => Promise<void>
}

export function ExpensesList({
  pendingExpenses,
  expensedExpenses,
  isLoading,
  markingExpensed,
  handleMarkAsExpensed,
  handleUnmarkAsExpensed,
}: ExpensesListContainerProps) {
  const allExpenses = [...pendingExpenses, ...expensedExpenses]

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 lg:p-8">
      <ExpensesCategoryList
        expenses={allExpenses}
        isLoading={isLoading}
        markingExpensed={markingExpensed}
        onAction={(id: string) => {
          const expense = allExpenses.find((e) => e.id === id)
          if (expense?.last_expensed_at) {
            return handleUnmarkAsExpensed(id)
          }
          return handleMarkAsExpensed(id)
        }}
        isPending={false}
      />
    </div>
  )
} 