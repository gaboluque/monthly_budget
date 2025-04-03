import type { CategoryData } from "../../lib/types/insights"
import { ShoppingBag, HeartHandshake, PiggyBank, CreditCard, TrendingUp, MoreHorizontal } from "lucide-react"

interface CategoryCardProps {
  category: string
  data: CategoryData
}

export function CategoryCard({ category, data }: CategoryCardProps) {
  // Get the appropriate icon based on category
  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case "needs":
        return <ShoppingBag className="h-5 w-5 text-blue-600" />
      case "wants":
        return <HeartHandshake className="h-5 w-5 text-red-600" />
      case "savings":
        return <PiggyBank className="h-5 w-5 text-green-600" />
      case "debt":
        return <CreditCard className="h-5 w-5 text-purple-600" />
      case "investment":
        return <TrendingUp className="h-5 w-5 text-amber-600" />
      default:
        return <MoreHorizontal className="h-5 w-5 text-gray-600" />
    }
  }

  // Get the appropriate color based on status
  const getStatusColor = () => {
    if (data?.status === "on_track") return "bg-green-500"
    if (data?.status === "warning") return "bg-yellow-500"
    if (data?.status === "over_budget") return "bg-red-500"
    return "bg-gray-300"
  }

  // Calculate percentage used
  const percentageUsed =
    typeof data?.percentage_used === "string" ? Number.parseFloat(data.percentage_used) : data?.percentage_used || 0

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-50 p-2 rounded-full mr-3">{getCategoryIcon()}</div>
          <h3 className="text-lg font-semibold capitalize">{category}</h3>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            percentageUsed < 70
              ? "bg-green-100 text-green-800"
              : percentageUsed < 90
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {percentageUsed}% used
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Spent</span>
          <span className="font-medium text-gray-900">${data?.monthly_expenses || "0"} / ${data?.budget_amount || "0"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Remaining</span>
          <span
            className={`font-medium ${Number.parseFloat(data?.remaining?.toString() || "0") > 0 ? "text-green-600" : "text-red-600"}`}
          >
            ${data?.remaining || "0"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${getStatusColor()} transition-all duration-1000 ease-in-out`}
              style={{
                width: `${Math.min(percentageUsed, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
