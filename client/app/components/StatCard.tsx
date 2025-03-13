import { LucideIcon } from "lucide-react"
import { formatCurrency } from "../lib/utils/currency"

interface StatCardProps {
  title: string
  amount: number
  description: string
  icon: LucideIcon
  iconSecondary: LucideIcon
  variant?: 'green' | 'blue'
}

export function StatCard({ 
  title, 
  amount, 
  description, 
  icon: Icon,
  iconSecondary: IconSecondary,
  variant = 'blue' 
}: StatCardProps) {
  const variantClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      title: 'text-green-700',
      icon: 'text-green-500',
      amount: 'text-green-900',
      description: 'text-green-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      title: 'text-blue-700',
      icon: 'text-blue-500',
      amount: 'text-blue-900',
      description: 'text-blue-600'
    }
  }

  const classes = variantClasses[variant]

  return (
    <div className={`${classes.bg} border ${classes.border} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-medium ${classes.title}`}>{title}</h4>
        <IconSecondary className={`w-4 h-4 ${classes.icon}`} />
      </div>
      <p className={`text-2xl font-bold ${classes.amount} mt-2`}>
        {formatCurrency(amount)}
      </p>
      <p className={`text-xs ${classes.description} mt-1`}>{description}</p>
    </div>
  )
} 