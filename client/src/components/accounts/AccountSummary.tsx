import { Wallet } from "lucide-react"
import { StatCard } from "../ui/StatCard"

interface AccountSummaryProps {
  totalBalance: number
  accountCount: number
}

export function AccountSummary({
  totalBalance,
  accountCount,
}: AccountSummaryProps) {


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
      </div>
    </div>
  )
} 