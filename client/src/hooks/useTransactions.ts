import { useState, useEffect } from "react";
import {
  transactionsApi,
} from "../lib/api/transactions";
import { accountsApi } from "../lib/api/accounts";
import {
  Transaction,
  TransactionType,
  TransactionsFilterParams,
  CreateTransactionData,
} from "../lib/types/transactions";
import { Account } from "../lib/types/accounts";
import { ui } from "../lib/ui/manager";
import { TransactionCategory } from "../lib/types/categories";
import { categoriesApi } from "../lib/api/categories";


export function useTransactions(initialParams?: TransactionsFilterParams) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    []
  );
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterParams, setFilterParams] = useState<TransactionsFilterParams>(
    initialParams || {}
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [transactionData, accountsData, typesData, categoriesData] =
          await Promise.all([
            transactionsApi.fetchAll(filterParams),
            accountsApi.fetchAll(),
            transactionsApi.fetchTypes(),
            categoriesApi.fetchAll(),
          ]);
        setTransactions(transactionData);
        setAccounts(accountsData);
        setTransactionTypes(typesData);
        setCategories(categoriesData);
      } catch (error) {
        ui.notify({
          message: "Failed to load transactions data",
          type: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filterParams]);

  const createTransaction = async (data: CreateTransactionData) => {
    setIsSubmitting(true);
    try {
      const newTransaction = await transactionsApi.create(data);
      setTransactions((prev) => [newTransaction, ...prev]);
      ui.notify({
        message: "Transaction created successfully",
        type: "success",
      });
      return newTransaction;
    } catch (error) {
      ui.notify({
        message: "Failed to create transaction",
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setIsSubmitting(true);
    try {
      await transactionsApi.delete(id);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );
      ui.notify({
        message: "Transaction rolled back successfully",
        type: "success",
      });
    } catch (error) {
      ui.notify({
        message: "Failed to rollback transaction",
        type: "error",
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyFilters = (newFilters: TransactionsFilterParams) => {
    setFilterParams((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilterParams({});
  };

  return {
    transactions,
    accounts,
    transactionTypes,
    categories,
    isLoading,
    isSubmitting,
    filterParams,
    createTransaction,
    deleteTransaction,
    applyFilters,
    clearFilters,
  };
}
