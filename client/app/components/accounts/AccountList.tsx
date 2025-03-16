import { AccountCard } from "./AccountCard"
import type { Account } from "../../lib/types/accounts"

interface AccountListProps {
  accounts: Account[]
  onEditAccount: (account: Account) => void
  onDeleteAccount: (account: Account) => void
}

export function AccountList({ accounts, onEditAccount, onDeleteAccount }: AccountListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onEdit={onEditAccount}
          onDelete={onDeleteAccount}
        />
      ))}
    </div>
  )
} 