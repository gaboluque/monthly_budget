import { PlusCircle } from "lucide-react"
import { Button } from "./Button"

interface PageHeaderProps {
  title: string
  description: string
  buttonText: string
  buttonColor?: 'green' | 'blue'
  onAction: () => void
}

export function PageHeader({ 
  title, 
  description, 
  buttonText, 
  buttonColor = 'blue',
  onAction 
}: PageHeaderProps) {
  const buttonColorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700'
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b pb-6">
      <div className="mb-4 sm:mb-0">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          onClick={onAction}
          className={`flex items-center justify-center gap-2 ${buttonColorClasses[buttonColor]} text-white px-4 py-2 rounded-lg transition-colors`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{buttonText}</span>
        </Button>
      </div>
    </div>
  )
} 