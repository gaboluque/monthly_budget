import { Loader2, Check } from "lucide-react"
import type { BudgetItem as BudgetItemType } from "../../lib/types/budget_items"
import { BudgetItem } from "./BudgetItem"
import { PageHeader } from "../ui/PageHeader"

interface BudgetItemListProps {
  budgetItems: BudgetItemType[]
  isLoading: boolean
  markingBudgetItemPaid: string | null
  onAction: (id: string) => void
}

export function BudgetItemList({
  budgetItems,
  isLoading,
  markingBudgetItemPaid,
  onAction,
}: BudgetItemListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 lg:p-8">
      <PageHeader title="Budget Items" />

      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading budget items...</span>
        </div>
      ) : budgetItems.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Check className={`w-8 h-8 text-gray-400`} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            All caught up!
          </h3>
          <p className="text-gray-500">
            You have paid all your budget items for this month
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgetItems.map((budgetItem) => (
            <BudgetItem
              key={budgetItem.id}
              budgetItem={budgetItem}
              isMarking={markingBudgetItemPaid === budgetItem.id}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  )
} 