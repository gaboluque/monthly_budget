import { useState, useEffect } from "react";
import { accountsApi } from "../lib/api/accounts";
import type { Account } from "../lib/types/accounts";
import { ui } from "../lib/ui/manager";

export function useExpenseAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accountsMap, setAccountsMap] = useState<Record<string, Account>>({});

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountsApi.getAll();
        setAccounts(data);

        // Create a map of account IDs to account objects for easy lookup
        const map: Record<string, Account> = {};
        data.forEach((account) => {
          map[account.id] = account;
        });
        setAccountsMap(map);
      } catch (error) {
        ui.notify({
          message: "Failed to load accounts",
          type: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Helper function to get account name by ID
  const getAccountName = (accountId: string): string => {
    const account = accountsMap[accountId];
    if (!account) return "Unknown Account";
    return account.name;
  };

  // Helper function to get full account details by ID
  const getAccount = (accountId: string): Account | undefined => {
    return accountsMap[accountId];
  };

  return {
    accounts,
    isLoading,
    accountsMap,
    getAccountName,
    getAccount,
  };
}
