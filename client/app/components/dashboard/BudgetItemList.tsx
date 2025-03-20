import { Loader2, Check, Calendar, ChevronDown, Building2, ChevronRight, Hourglass } from "lucide-react"
import type { BudgetItem } from "../../lib/types/budget_items"
import { BudgetItemItem } from "./BudgetItem"
import { formatCurrency } from "../../lib/utils/currency"
import { useMemo, useState } from "react"
import { useAccounts } from "../../hooks/useAccounts"

interface BudgetItemListProps {
  budgetItems: BudgetItem[]
  isLoading: boolean
  markingBudgetItemPaid: string | null
  onAction: (id: string) => void
}

interface BudgetItemDestinationGroupProps {
  destinationName: string
  budgetItems: BudgetItem[]
  markingBudgetItemPaid: string | null
  onAction: (id: string) => void
  isExpanded: boolean
  onToggle: () => void
}

function BudgetItemDestinationGroup({
  destinationName,
  budgetItems,
  markingBudgetItemPaid,
  onAction,
  isExpanded,
  onToggle
}: BudgetItemDestinationGroupProps) {
  const totalAmount = budgetItems.reduce((sum, budgetItem) => sum + Number(budgetItem.amount || 0), 0)

  // Calculate pending and paid counts
  const paidCount = budgetItems.filter(budgetItem => budgetItem.last_paid_at).length
  const pendingCount = budgetItems.length - paidCount

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full bg-gray-50 px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <Building2 className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">{destinationName}</h3>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Hourglass className="w-3 h-3" /> {pendingCount}
            </span>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-900">{formatCurrency(totalAmount)}</div>
      </button>
      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {budgetItems.map((budgetItem) => (
            <BudgetItemItem
              key={budgetItem.id}
              budgetItem={budgetItem}
              isMarking={markingBudgetItemPaid === budgetItem.id}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function BudgetItemList({
  budgetItems,
  isLoading,
  markingBudgetItemPaid,
  onAction,
}: BudgetItemListProps) {
  const { accounts } = useAccounts();

  const getAccountName = (accountId: string) => {
    const account = accounts.find(account => account.id === accountId);
    return account ? account.name : "Unknown";
  }

  // State to track expanded destinations
  const [expandedDestinations, setExpandedDestinations] = useState<Set<string>>(new Set())

  const budgetItemsCount = useMemo(() => {
    return budgetItems.reduce((acc, budgetItem) => {
      if (budgetItem.last_paid_at) {
        acc.paid++
      } else {
        acc.pending++
      }
      return acc
    }, {
      pending: 0,
      paid: 0,
    })
  }, [budgetItems])

  // Toggle destination expansion
  const toggleDestination = (destinationId: string) => {
    setExpandedDestinations((prev) => {
      const next = new Set(prev)
      if (next.has(destinationId)) {
        next.delete(destinationId)
      } else {
        next.add(destinationId)
      }
      return next
    })
  }

  // Group budget items by account_id
  const budgetItemsByDestination = useMemo(() => {
    return budgetItems.reduce<Record<string, BudgetItem[]>>((groups, budgetItem) => {
      const accountId = budgetItem.account_id || "unknown"
      if (!groups[accountId]) {
        groups[accountId] = []
      }
      groups[accountId].push(budgetItem)
      return groups
    }, {})
  }, [budgetItems]);

  // Sort destinations by total amount
  const sortedDestinations = useMemo(() => {
    return Object.entries(budgetItemsByDestination)
      .sort(([, budgetItemsA], [, budgetItemsB]) => {
        const totalA = budgetItemsA.reduce((sum, budgetItem) => sum + budgetItem.amount, 0)
        const totalB = budgetItemsB.reduce((sum, budgetItem) => sum + budgetItem.amount, 0)
        return totalB - totalA
      })
      .map(([destinationId]) => destinationId)
  }, [budgetItemsByDestination]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 lg:p-8">
      <div className="flex flex-col mb-6 pb-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className={`w-5 h-5 text-green-500`} />
            Budget Items
          </h2>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Pending: {budgetItemsCount.pending}
            </span>
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Paid: {budgetItemsCount.paid}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading budget items...</span>
        </div>
      ) : budgetItems.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Check className={`w-8 h-8 text-gray-400`} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            All caught up!
          </h3>
          <p className="text-gray-500">
            You haven&apos;t marked any budget items as paid yet
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDestinations.map((destinationId) => (
            <BudgetItemDestinationGroup
              key={destinationId}
              destinationName={getAccountName(destinationId)}
              budgetItems={budgetItemsByDestination[destinationId]}
              markingBudgetItemPaid={markingBudgetItemPaid}
              onAction={onAction}
              isExpanded={expandedDestinations.has(destinationId)}
              onToggle={() => toggleDestination(destinationId)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 