import { ChevronDown, ChevronRight, PlusCircle } from "lucide-react"
import { formatCurrency } from "../../lib/utils/currency"
import { ExpenseItem } from "./ExpenseItem"
import type { Expense } from "../../lib/types/expenses"
import { CATEGORY_COLORS } from "../../lib/types/expenses"

interface ExpenseCategoryProps {
  category: string
  expenses: Expense[]
  isExpanded: boolean
  onToggle: (category: string) => void
  onAddExpense: (category: string) => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
}

export function ExpenseCategory({
  category,
  expenses,
  isExpanded,
  onToggle,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}: ExpenseCategoryProps) {
  const totalAmount = expenses.reduce((sum, expense) => sum + (Number(expense.amount || 0)), 0)
  const categoryColor = CATEGORY_COLORS[category] || "#6b7280" // Default to gray if category not found

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4" 
        style={{ backgroundColor: `${categoryColor}10` }}
      >
        <button onClick={() => onToggle(category)} className="flex items-center gap-2 text-left w-full">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" style={{ color: categoryColor }} />
          ) : (
            <ChevronRight className="w-4 h-4" style={{ color: categoryColor }} />
          )}
          <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
          <span 
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor
            }}
          >
            {formatCurrency(totalAmount)}
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddExpense(category)
          }}
          className="ml-4 flex-shrink-0 p-1.5 rounded-md transition-colors hover:bg-opacity-20"
          style={{ 
            color: categoryColor,
            backgroundColor: "transparent"
          }}
          aria-label={`Add expense to ${category}`}
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid gap-3">
            {expenses.length === 0 ? (
              <button
                onClick={() => onAddExpense(category)}
                className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm text-gray-500">No expenses in this category.</p>
                <p className="text-sm text-blue-600 mt-1">Click to add one</p>
              </button>
            ) : (
              expenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={onEditExpense}
                  onDelete={onDeleteExpense}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 