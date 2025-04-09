import { AccountCard } from "./AccountCard"
import type { Account } from "../../lib/types/accounts"

interface AccountListProps {
  accounts: Account[]
  onEditAccount: (account: Account) => void
  onDeleteAccount: (account: Account) => void
}

export function AccountList({ accounts, onEditAccount, onDeleteAccount }: AccountListProps) {
  return (
    <div className="grid gap-2">
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