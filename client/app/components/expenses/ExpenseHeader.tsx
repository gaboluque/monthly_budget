import { PageHeader } from "../ui/PageHeader"

interface ExpenseHeaderProps {
  onAddExpense: () => void
}

export function ExpenseHeader({ onAddExpense }: ExpenseHeaderProps) {
  return (
    <PageHeader
      title="Monthly Expenses"
      description="A list of all your expenses organized by category."
      buttonText="Add Expense"
      buttonColor="blue"
      onAction={onAddExpense}
    />
  )
} 