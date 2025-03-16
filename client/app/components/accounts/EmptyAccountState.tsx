import { Plus } from "lucide-react"
import { Button } from "../ui/Button"

interface EmptyAccountStateProps {
  onAddAccount: () => void
}

export function EmptyAccountState({ onAddAccount }: EmptyAccountStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Plus className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No accounts yet</h3>
      <p className="text-gray-500 mb-4">Get started by adding your first account</p>
      <Button onClick={onAddAccount} className="inline-flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        <span>Add Account</span>
      </Button>
    </div>
  )
} 