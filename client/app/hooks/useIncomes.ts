import { useState, useEffect, useMemo } from "react";
import { incomesApi } from "../lib/api/incomes";
import type { Income, CreateIncomeData } from "../lib/types/incomes";
import { ui } from "../lib/ui/manager";

export function useIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
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
      ui.notify({
        message: "Failed to fetch incomes",
        type: "error",
      });
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
      ui.notify({
        message: "Failed to create income",
        type: "error",
      });
      return false;
    }
  };

  const updateIncome = async (id: string, data: CreateIncomeData) => {
    try {
      await incomesApi.update(id, data);
      await fetchIncomes();
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to update income",
        type: "error",
      });
      return false;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await incomesApi.delete(id);
      await fetchIncomes();
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to delete income",
        type: "error",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return {
    incomes,
    isLoading,
    totalIncome,
    createIncome,
    updateIncome,
    deleteIncome,
  };
}
