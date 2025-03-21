import { CreditCard } from "lucide-react"
import type { BudgetItem } from "../../lib/types/budget_items"
import { CATEGORY_COLORS } from "../../lib/types/budget_items"
import { FinancialItem } from "../shared/FinancialItem"

interface BudgetItemItemProps {
  budgetItem: BudgetItem
  isMarking: boolean
  onAction: (id: string) => void
}

export function BudgetItem({ budgetItem, isMarking, onAction }: BudgetItemItemProps) {
  const categoryColor = CATEGORY_COLORS[budgetItem.category.toLowerCase()] || CATEGORY_COLORS.other

  const categoryBadge = (
    <span
      className="text-xs font-medium px-2 py-1 rounded-full w-24 text-center"
      style={{
        backgroundColor: `${categoryColor}20`,
        color: categoryColor
      }}
    >
      {budgetItem.category}
    </span>
  )

  return (
    <FinancialItem
      id={budgetItem.id}
      name={budgetItem.name}
      amount={budgetItem.amount}
      frequency={budgetItem.frequency}
      isPending={budgetItem.is_pending}
      accountName={budgetItem.account?.name}
      icon={CreditCard}
      isMarking={isMarking}
      onAction={onAction}
      actionText={{
        pending: "Mark as Paid",
        completed: "Mark as Pending"
      }}
      badge={categoryBadge}
    />
  )
} 