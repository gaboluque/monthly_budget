import { useState } from "react";
import { Layout } from "../components/ui/Layout";
import { Modal } from "../components/ui/Modal";
import { AccountSummary } from "../components/accounts/AccountSummary";
import { AccountList } from "../components/accounts/AccountList";
import { EmptyAccountState } from "../components/accounts/EmptyAccountState";
import { AccountForm } from "../components/accounts/AccountForm";
import { useAccounts } from "../hooks/useAccounts";
import { ui } from "../lib/ui/manager";
import type { Account, CreateAccountData } from "../lib/types/accounts";
import { PageHeader } from "../components/ui/PageHeader";
import { Spinner } from "../components/ui/Spinner";

export default function AccountsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const {
    accounts,
    accountTypes,
    currencies,
    isLoading,
    totalBalance,
    createAccount,
    updateAccount,
    deleteAccount
  } = useAccounts();

  const handleAddAccount = async (data: CreateAccountData) => {
    await createAccount(data);
    setIsAddModalOpen(false);
  };

  const handleEditAccount = async (data: CreateAccountData) => {
    if (!selectedAccount) return;

    await updateAccount(selectedAccount.id, data);
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (account: Account) => {
    ui.confirm({
      title: "Delete Account",
      message: `Are you sure you want to delete "${account.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmVariant: "danger",
      onConfirm: async () => {
        await deleteAccount(account.id);
      }
    });
  };

  const openEditModal = (account: Account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      <PageHeader
        title="Accounts"
        description="Manage your financial accounts and track your balances."
        buttonText="Add Account"
        buttonColor="blue"
        onAction={() => setIsAddModalOpen(true)}
      />

      {/* Account Summary */}
      {!isLoading && accounts.length > 0 && (
        <AccountSummary
          totalBalance={totalBalance}
          accountCount={accounts.length}
        />
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-gray-500">
          <Spinner />
        </div>
      ) : accounts.length === 0 ? (
        <EmptyAccountState onAddAccount={() => setIsAddModalOpen(true)} />
      ) : (
        <AccountList
          accounts={accounts}
          onEditAccount={openEditModal}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      {/* Add Account Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Account"
      >
        <AccountForm
          onSubmit={handleAddAccount}
          onCancel={() => setIsAddModalOpen(false)}
          accountTypes={accountTypes}
          currencies={currencies}
        />
      </Modal>

      {/* Edit Account Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccount(null);
        }}
        title="Edit Account"
      >
        <AccountForm
          initialData={selectedAccount ?? undefined}
          onSubmit={handleEditAccount}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedAccount(null);
          }}
          accountTypes={accountTypes}
          currencies={currencies}
        />
      </Modal>
    </Layout>
  );
} 