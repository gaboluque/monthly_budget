import { Wallet, CreditCard, PiggyBank, DollarSign, Landmark, HelpCircle } from "lucide-react"
import type { Account } from "../../lib/types/accounts"
import { formatCurrency } from "../../lib/utils/currency"
import { useMemo } from "react"
import { ListCard } from "../ui/ListCard"
import { formatAccountType } from "../../lib/utils/formatters"
interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
}

export function AccountCard({ account, onEdit }: AccountCardProps) {
  const { Icon, color } = useMemo(() => {
    switch (account.account_type) {
      case "savings":
        return {
          Icon: PiggyBank,
          color: "bg-emerald-50 text-emerald-600"
        }
      case "credit_card":
        return {
          Icon: CreditCard,
          color: "bg-purple-50 text-purple-600"
        }
      case "checking":
        return {
          Icon: Wallet,
          color: "bg-blue-50 text-blue-600"
        }
      case "investment":
        return {
          Icon: DollarSign,
          color: "bg-amber-50 text-amber-600"
        }
      case "loan":
        return {
          Icon: Landmark,
          color: "bg-red-50 text-red-600"
        }
      default:
        return {
          Icon: HelpCircle,
          color: "bg-gray-50 text-gray-600"
        }
    }
  }, [account.account_type]);

  return (
    <ListCard
      icon={(
        <div className={`p-1 w-full h-full rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      title={account.name}
      description={formatAccountType(account.account_type)}
      amount={formatCurrency(account.balance)}
      onClick={() => onEdit(account)}
    />
  )
} 