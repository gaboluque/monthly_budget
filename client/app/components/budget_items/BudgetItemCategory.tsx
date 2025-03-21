import { ChevronDown, ChevronRight, PlusCircle } from "lucide-react"
import { formatCurrency } from "../../lib/utils/currency"
import { BudgetItem } from "./BudgetItem"
import type { BudgetItem as BudgetItemType } from "../../lib/types/budget_items"
import { CATEGORY_COLORS } from "../../lib/types/budget_items"

interface BudgetItemCategoryProps {
  category: string
  budgetItems: BudgetItemType[]
  isExpanded: boolean
  onToggle: (category: string) => void
  onAddBudgetItem: (category: string) => void
  onEditBudgetItem: (budgetItem: BudgetItemType) => void
  onDeleteBudgetItem: (id: string) => void
}

export function BudgetItemCategory({
  category,
  budgetItems,
  isExpanded,
  onToggle,
  onAddBudgetItem,
  onEditBudgetItem,
  onDeleteBudgetItem,
}: BudgetItemCategoryProps) {
  const totalAmount = budgetItems.reduce((sum, budgetItem) => sum + (Number(budgetItem.amount || 0)), 0)
  const categoryColor = CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.other

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
            onAddBudgetItem(category)
          }}
          className="ml-4 flex-shrink-0 p-1.5 rounded-md transition-colors hover:bg-opacity-20"
          style={{
            color: categoryColor,
            backgroundColor: "transparent"
          }}
          aria-label={`Add budget item to ${category}`}
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid gap-3">
            {budgetItems.length === 0 ? (
              <button
                onClick={() => onAddBudgetItem(category)}
                className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm text-gray-500">No budget items in this category.</p>
                <p className="text-sm text-blue-600 mt-1">Click to add one</p>
              </button>
            ) : (
              budgetItems.map((budgetItem) => (
                <BudgetItem
                  key={budgetItem.id}
                  budgetItem={budgetItem}
                  onEdit={onEditBudgetItem}
                  onDelete={onDeleteBudgetItem}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 