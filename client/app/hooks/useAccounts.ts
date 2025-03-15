import { useState, useEffect, useCallback } from "react";
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
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  // Consolidate data fetching into a single function with caching
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Skip fetching if data was loaded recently (within last 5 minutes) unless forced
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
      const now = Date.now();

      if (
        !forceRefresh &&
        lastFetchTime &&
        now - lastFetchTime < CACHE_DURATION &&
        accounts.length > 0 &&
        accountTypes.length > 0 &&
        currencies.length > 0
      ) {
        return;
      }

      setIsLoading(true);

      try {
        const [accountsData, typesData, currenciesData] = await Promise.all([
          accountsApi.getAll(),
          accountsApi.getAccountTypes(),
          accountsApi.getCurrencies(),
        ]);

        setAccounts(accountsData);
        setAccountTypes(typesData);
        setCurrencies(currenciesData);
        setLastFetchTime(now);
      } catch (error) {
        ui.notify({
          message: "Failed to load accounts data",
          type: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [accounts.length, accountTypes.length, currencies.length, lastFetchTime]
  );

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Optimistic update helper function
  const optimisticUpdate = useCallback(
    (updatedAccount: Account, isDelete = false) => {
      setAccounts((prev) => {
        if (isDelete) {
          return prev.filter((account) => account.id !== updatedAccount.id);
        }

        const exists = prev.some((account) => account.id === updatedAccount.id);
        if (exists) {
          return prev.map((account) =>
            account.id === updatedAccount.id ? updatedAccount : account
          );
        } else {
          return [...prev, updatedAccount];
        }
      });
    },
    []
  );

  const createAccount = async (data: CreateAccountData) => {
    try {
      // Create a temporary optimistic account
      const tempAccount: Account = {
        id: `temp-${Date.now()}`,
        name: data.name,
        balance: data.balance,
        account_type: data.account_type,
        currency: data.currency,
        description: data.description || "",
        is_owned: data.is_owned || true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistically update UI
      optimisticUpdate(tempAccount);

      // Perform actual API call
      const newAccount = await accountsApi.create(data);

      // Update with real data from server
      optimisticUpdate(newAccount);

      ui.notify({
        message: `Account "${data.name}" created successfully`,
        type: "success",
      });

      return newAccount;
    } catch (error) {
      // Refresh data to ensure UI is in sync with server
      fetchData(true);

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
      // Find existing account
      const existingAccount = accounts.find((account) => account.id === id);
      if (!existingAccount) {
        throw new Error(`Account with ID ${id} not found`);
      }

      // Create optimistic update
      const optimisticAccount: Account = {
        ...existingAccount,
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Update UI optimistically
      optimisticUpdate(optimisticAccount);

      // Perform actual API call
      const updatedAccount = await accountsApi.update(id, data);

      // Update with real data from server
      optimisticUpdate(updatedAccount);

      ui.notify({
        message: `Account "${data.name}" updated successfully`,
        type: "success",
      });

      return updatedAccount;
    } catch (error) {
      // Refresh data to ensure UI is in sync with server
      fetchData(true);

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
      // Find existing account
      const existingAccount = accounts.find((account) => account.id === id);
      if (!existingAccount) {
        throw new Error(`Account with ID ${id} not found`);
      }

      // Update UI optimistically
      optimisticUpdate(existingAccount, true);

      // Perform actual API call
      await accountsApi.delete(id);

      ui.notify({
        message: "Account deleted successfully",
        type: "success",
      });
    } catch (error) {
      // Refresh data to ensure UI is in sync with server
      fetchData(true);

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
    refreshAccounts: () => fetchData(true),
  };
}
