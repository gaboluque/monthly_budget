import { useState, useEffect, useMemo } from "react";
import { incomesApi } from "../lib/api/incomes";
import type { Income, CreateIncomeData } from "../lib/types/incomes";

export function useIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const totalIncome = useMemo(() => {
    if (incomes.length === 0) return 0;
    return incomes.reduce((acc, income) => acc + Number(income.amount), 0);
  }, [incomes]);

  const fetchIncomes = async () => {
    try {
      const data = await incomesApi.getAll();
      setIncomes(data);
    } catch (error) {
      setError("Failed to fetch incomes");
    } finally {
      setIsLoading(false);
    }
  };

  const createIncome = async (data: CreateIncomeData) => {
    try {
      await incomesApi.create(data);
      await fetchIncomes();
      return true;
    } catch (error) {
      setError("Failed to create income");
      return false;
    }
  };

  const updateIncome = async (id: string, data: CreateIncomeData) => {
    try {
      await incomesApi.update(id, data);
      await fetchIncomes();
      return true;
    } catch (error) {
      setError("Failed to update income");
      return false;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await incomesApi.delete(id);
      await fetchIncomes();
      return true;
    } catch (error) {
      setError("Failed to delete income");
      return false;
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return {
    incomes,
    error,
    isLoading,
    totalIncome,
    createIncome,
    updateIncome,
    deleteIncome,
    clearError: () => setError(null),
  };
}
