import { formatCurrency } from "../../lib/utils/currency"
import { NATURE_COLORS } from "../../lib/types/budgets"
import { Budget } from "../../lib/types/budgets"
interface NatureDistributionProps {
  budgetsByNature: Record<string, Budget[]>
  total: number
  className?: string
}

export function NatureDistribution({ budgetsByNature, total, className = "" }: NatureDistributionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Object.entries(budgetsByNature).map(([nature, budgets]) => {
        console.log({
          nature,
          budgets,
          total,
        })


        const amount = budgets.reduce((acc, budget) => Number(acc) + Number(budget.amount), 0)
        const percentage = total > 0 ? (amount / total) * 100 : 0
        const natureColor = NATURE_COLORS[nature.toLowerCase()] || NATURE_COLORS.other

        console.log({
          nature,
          amount,
          percentage,
          natureColor,
        })

        return (
          <div key={nature} className="flex items-center gap-2">
            <div className="w-24 text-sm font-medium" style={{ color: natureColor }}>
              {nature}
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage.toFixed(1)}%`,
                    backgroundColor: natureColor
                  }}
                />
              </div>
            </div>
            <div className="w-24 text-sm text-right">
              <span className="font-medium" style={{ color: natureColor }}>
                {formatCurrency(amount || 0)}
              </span>
              <span className="text-gray-500 text-xs ml-1">
                ({percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
} 