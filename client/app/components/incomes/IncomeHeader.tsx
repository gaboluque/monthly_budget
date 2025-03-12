import { PageHeader } from "../PageHeader"

interface IncomeHeaderProps {
  onAddIncome: () => void
}

export function IncomeHeader({ onAddIncome }: IncomeHeaderProps) {
  return (
    <PageHeader
      title="Income Sources"
      description="A list of all your income sources including their name, amount, and frequency."
      buttonText="Add Income"
      buttonColor="green"
      onAction={onAddIncome}
    />
  )
} 