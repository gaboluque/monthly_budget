import { CATEGORY_COLORS } from "../../lib/types/budget_items"
import type { CategoryData } from "../../lib/types/insights"
import { ShoppingBag, HeartHandshake, PiggyBank, CreditCard, TrendingUp, MoreHorizontal } from "lucide-react"

interface BudgetDistributionChartProps {
  categories: Record<string, CategoryData>
}

export function BudgetDistributionChart({ categories }: BudgetDistributionChartProps) {
  // Helper function to get color based on category
  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.other
  }

  // Get the appropriate icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "needs":
        return <ShoppingBag className="h-4 w-4" />
      case "wants":
        return <HeartHandshake className="h-4 w-4" />
      case "savings":
        return <PiggyBank className="h-4 w-4" />
      case "debt":
        return <CreditCard className="h-4 w-4" />
      case "investment":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <MoreHorizontal className="h-4 w-4" />
    }
  }

  if (!categories || Object.keys(categories).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div className="text-gray-400 mb-2">
          <MoreHorizontal className="h-10 w-10" />
        </div>
        <p className="text-center text-gray-500">No budget categories defined</p>
      </div>
    )
  }

  // Calculate total budget
  const totalBudget = Object.values(categories).reduce((sum, cat) => {
    const amount = typeof cat.budget_amount === "string" ? Number.parseFloat(cat.budget_amount) : cat.budget_amount
    return sum + amount
  }, 0)

  // Filter out categories with 0 budget amount
  const validCategories = Object.entries(categories).filter(([, data]) => {
    const budgetAmount =
      typeof data.budget_amount === "string" ? Number.parseFloat(data.budget_amount) : data.budget_amount
    return budgetAmount > 0
  })

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="flex h-12 rounded-xl overflow-hidden shadow-inner bg-gray-100">
        {validCategories.map(([category, data]) => {
          // Calculate percentage for this category
          const budgetAmount =
            typeof data.budget_amount === "string" ? Number.parseFloat(data.budget_amount) : data.budget_amount
          const percentage = totalBudget > 0 ? (budgetAmount / totalBudget) * 100 : 0;
          const categoryColor = getCategoryColor(category);

          return (
            <div
              key={category}
              className="h-full relative group transition-all duration-300 hover:brightness-110"
              style={{
                width: `${percentage}%`,
                backgroundColor: categoryColor,
                minWidth: percentage > 0 ? "1.5rem" : "0",
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-10 transition-opacity duration-200">
                <span className="capitalize font-medium">{category}</span>: ${data.budget_amount} (
                {percentage.toFixed(1)}%)
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {validCategories.map(([category, data]) => {
          // Calculate percentage for this category
          const budgetAmount =
            typeof data.budget_amount === "string" ? Number.parseFloat(data.budget_amount) : data.budget_amount
          const percentage = totalBudget > 0 ? (budgetAmount / totalBudget) * 100 : 0;
          const categoryColor = getCategoryColor(category);

          return (
            <div key={category} className="flex items-center px-3 py-2 rounded-lg">
              <div
                className="w-6 h-6 mr-2 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
              >
                {getCategoryIcon(category)}
              </div>
              <div>
                <span className="text-sm font-medium capitalize">{category}</span>
                <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

