import { Wallet } from "lucide-react"
import { StatCard } from "../ui/StatCard"
import { formatCurrency } from "../../lib/utils/currency"
import type { AccountsByType } from "../../hooks/useAccounts"

const accountTypeColors: Record<string, string> = {
  checking: "bg-blue-500",
  savings: "bg-green-500",
  credit_card: "bg-purple-500",
  investment: "bg-amber-500",
  loan: "bg-red-500",
  cash: "bg-emerald-500",
  other: "bg-gray-500"
}

const getAccountTypeColor = (type: string): string => {
  return accountTypeColors[type] || accountTypeColors.other
}

interface AccountSummaryProps {
  totalBalance: number
  accountCount: number
  accountsByType: AccountsByType
}

export function AccountSummary({
  totalBalance,
  accountCount,
  accountsByType
}: AccountSummaryProps) {
  const typeBalances = Object.fromEntries(
    Object.entries(accountsByType).map(([type, accounts]) => [
      type,
      accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0)
    ])
  )

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        Account Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Balance"
          amount={totalBalance}
          description={`${accountCount} accounts`}
          icon={Wallet}
          variant="blue"
        />
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Account Distribution</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(typeBalances).map(([type, amount]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getAccountTypeColor(type)}`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{type}</div>
                  <div className="text-xs text-gray-500">{formatCurrency(amount, false)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 