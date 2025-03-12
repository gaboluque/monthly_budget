import { PlusCircle } from "lucide-react"
import { Button } from "../Button"

interface IncomeHeaderProps {
  onAddIncome: () => void
}

export function IncomeHeader({ onAddIncome }: IncomeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b pb-6">
      <div className="mb-4 sm:mb-0">
        <h2 className="text-xl font-bold text-gray-900">Income Sources</h2>
        <p className="mt-1 text-sm text-gray-600">
          A list of all your income sources including their name, amount, and frequency.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          onClick={onAddIncome}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Income</span>
        </Button>
      </div>
    </div>
  )
} 