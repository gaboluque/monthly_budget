import { formatCurrency } from "../lib/utils/currency"
import { CATEGORY_COLORS } from "../lib/types/budget_items"

interface CategoryDistributionProps {
  categories: Record<string, number>
  total: number
  className?: string
}

export function CategoryDistribution({ categories, total, className = "" }: CategoryDistributionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Object.entries(categories).map(([category, amount]) => {
        const percentage = total > 0 ? (amount / total) * 100 : 0
        const categoryColor = CATEGORY_COLORS[category] || "#6b7280"

        return (
          <div key={category} className="flex items-center gap-2">
            <div className="w-24 text-sm font-medium" style={{ color: categoryColor }}>
              {category}
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: categoryColor
                  }}
                />
              </div>
            </div>
            <div className="w-24 text-sm text-right">
              <span className="font-medium" style={{ color: categoryColor }}>
                {formatCurrency(amount)}
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