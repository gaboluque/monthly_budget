import { Trash2, Edit, Wallet, CreditCard, PiggyBank, DollarSign, Landmark, HelpCircle } from "lucide-react"
import type { Account } from "../../lib/types/accounts"
import { formatCurrency } from "../../lib/utils/currency"
import { useMemo } from "react"

interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
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
    <div className="bg-white rounded-xl shadow-sm-xs hover:shadow-sm-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-800">{account.name}</h3>
              <p className="text-sm text-gray-500">{account.account_type}</p>
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <button
              className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
              onClick={() => onEdit(account)}
              aria-label="Edit account"
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              onClick={() => onDelete(account)}
              aria-label="Delete account"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-md font-bold text-gray-900">
            <span className="text-sm text-gray-500">{account.currency}</span>
            <br />
            {formatCurrency(account.balance, false)}
          </div>
          {account.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{account.description}</p>
          )}
          <div className="text-xs text-gray-400 mt-1">
            Last updated: {new Date(account.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
} 