import { PageHeader } from "../ui/PageHeader"

interface AccountHeaderProps {
  onAddAccount: () => void
}

export function AccountHeader({ onAddAccount }: AccountHeaderProps) {
  return (
    <PageHeader
      title="My Accounts"
      description="Manage your financial accounts and track your balances."
      buttonText="Add Account"
      buttonColor="blue"
      onAction={onAddAccount}
    />
  )
} 