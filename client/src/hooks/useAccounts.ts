import { useState, useEffect } from "react";
import { accountsApi } from "../lib/api/accounts";
import {
  Account,
  CreateAccountData,
  AccountType,
  Currency,
} from "../lib/types/accounts";
import { ui } from "../lib/ui/manager";

export type AccountsByType = Record<string, Account[]>;

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [accountsByType, setAccountsByType] = useState<AccountsByType>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, typesData, currenciesData] = await Promise.all([
          accountsApi.getAll(),
          accountsApi.getAccountTypes(),
          accountsApi.getCurrencies(),
        ]);
        setAccounts(accountsData);
        setAccountTypes(typesData);
        setCurrencies(currenciesData);
      } catch (error) {
        ui.notify({
          message: "Failed to load accounts data",
          type: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate derived state whenever accounts change
  useEffect(() => {
    // Calculate total balance
    const total = accounts.reduce((sum, account) => {
      return sum + Number(account.balance || 0);
    }, 0);
    setTotalBalance(total);

    // Group accounts by type
    const byType: AccountsByType = {};
    accounts.forEach((account) => {
      if (!byType[account.account_type]) byType[account.account_type] = [];

      byType[account.account_type].push(account);
    });
    setAccountsByType(byType);
  }, [accounts]);

  const createAccount = async (data: CreateAccountData) => {
    try {
      const newAccount = await accountsApi.create(data);
      setAccounts((prev) => [...prev, newAccount]);
      ui.notify({
        message: `Account "${data.name}" created successfully`,
        type: "success",
      });
      return newAccount;
    } catch (error) {
      ui.notify({
        message: "Failed to create account",
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  };

  const updateAccount = async (id: string, data: CreateAccountData) => {
    try {
      const updatedAccount = await accountsApi.update(id, data);
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account
        )
      );
      ui.notify({
        message: `Account "${data.name}" updated successfully`,
        type: "success",
      });
      return updatedAccount;
    } catch (error) {
      ui.notify({
        message: "Failed to update account",
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await accountsApi.delete(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      ui.notify({
        message: "Account deleted successfully",
        type: "success",
      });
    } catch (error) {
      ui.notify({
        message: "Failed to delete account",
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  };

  return {
    accounts,
    accountTypes,
    currencies,
    isLoading,
    totalBalance,
    accountsByType,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}
