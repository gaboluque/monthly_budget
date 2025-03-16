import { Loader2, Check, Calendar, ChevronDown, Building2, ChevronRight, Hourglass } from "lucide-react"
import type { Expense } from "../../lib/types/expenses"
import { ExpenseItem } from "./ExpenseItem"
import { formatCurrency } from "../../lib/utils/currency"
import { useMemo, useState } from "react"
import { useExpenseAccounts } from "../../hooks/useExpenseAccounts"

interface ExpensesListProps {
  expenses: Expense[]
  isLoading: boolean
  markingExpensed: string | null
  onAction: (id: string) => void
}

interface ExpenseDestinationGroupProps {
  destinationName: string
  expenses: Expense[]
  markingExpensed: string | null
  onAction: (id: string) => void
  isExpanded: boolean
  onToggle: () => void
}

function ExpenseDestinationGroup({
  destinationName,
  expenses,
  markingExpensed,
  onAction,
  isExpanded,
  onToggle
}: ExpenseDestinationGroupProps) {
  const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)

  // Calculate pending and expensed counts
  const expensedCount = expenses.filter(expense => expense.last_expensed_at).length
  const pendingCount = expenses.length - expensedCount

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full bg-gray-50 px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <Building2 className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">{destinationName}</h3>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Hourglass className="w-3 h-3" /> {pendingCount}
            </span>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-900">{formatCurrency(totalAmount)}</div>
      </button>
      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              isMarking={markingExpensed === expense.id}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ExpensesList({
  expenses,
  isLoading,
  markingExpensed,
  onAction,
}: ExpensesListProps) {
  const { getAccountName } = useExpenseAccounts();

  // State to track expanded destinations
  const [expandedDestinations, setExpandedDestinations] = useState<Set<string>>(new Set())

  const expensesCount = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      if (expense.last_expensed_at) {
        acc.expensed++
      } else {
        acc.pending++
      }
      return acc
    }, {
      pending: 0,
      expensed: 0,
    })
  }, [expenses])

  // Toggle destination expansion
  const toggleDestination = (destinationId: string) => {
    setExpandedDestinations((prev) => {
      const next = new Set(prev)
      if (next.has(destinationId)) {
        next.delete(destinationId)
      } else {
        next.add(destinationId)
      }
      return next
    })
  }

  // Group expenses by account_id
  const expensesByDestination = useMemo(() => {
    return expenses.reduce<Record<string, Expense[]>>((groups, expense) => {
      const accountId = expense.account_id || "unknown"
      if (!groups[accountId]) {
        groups[accountId] = []
      }
      groups[accountId].push(expense)
      return groups
    }, {})
  }, [expenses]);

  // Sort destinations by total amount
  const sortedDestinations = useMemo(() => {
    return Object.entries(expensesByDestination)
      .sort(([, expensesA], [, expensesB]) => {
        const totalA = expensesA.reduce((sum, exp) => sum + exp.amount, 0)
        const totalB = expensesB.reduce((sum, exp) => sum + exp.amount, 0)
        return totalB - totalA
      })
      .map(([destinationId]) => destinationId)
  }, [expensesByDestination]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 lg:p-8">
      <div className="flex flex-col mb-6 pb-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className={`w-5 h-5 text-green-500`} />
            Expenses
          </h2>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Pending: {expensesCount.pending}
            </span>
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Expensed: {expensesCount.expensed}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading expenses...</span>
        </div>
      ) : expenses.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Check className={`w-8 h-8 text-gray-400`} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            All caught up!
          </h3>
          <p className="text-gray-500">
            You haven&apos;t marked any expenses as paid yet
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDestinations.map((destinationId) => (
            <ExpenseDestinationGroup
              key={destinationId}
              destinationName={getAccountName(destinationId)}
              expenses={expensesByDestination[destinationId]}
              markingExpensed={markingExpensed}
              onAction={onAction}
              isExpanded={expandedDestinations.has(destinationId)}
              onToggle={() => toggleDestination(destinationId)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 