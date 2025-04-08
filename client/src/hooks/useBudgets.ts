import { useState, useEffect, useMemo } from "react";
import type {
  Budget,
  CreateBudgetData,
} from "../lib/types/budgets";
import { ui } from "../lib/ui/manager";
import { budgetsApi } from "../lib/api/budgets";

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalBudgets = useMemo(() => {
    if (budgets.length === 0) return 0;
    return budgets.reduce(
      (acc, budget) => acc + Number(budget.amount),
      0
    );
  }, [budgets]);


  const fetchBudgets = async () => {
    try {
      const data = await budgetsApi.fetchAll();
      setBudgets(data);
    } catch (error) {
      ui.notify({
        message: "Failed to fetch budgets",
        type: "error",
        error: error as Error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBudget = async (data: CreateBudgetData) => {
    try {
      const budget = await budgetsApi.create(data);
      await fetchBudgets();
      ui.notify({
        message: "Budget created successfully",
        type: "success",
      });
      return budget;
    } catch (error) {
      ui.notify({
        message: "Failed to create budget",
        type: "error",
        error: error as Error,
      });
      return null;
    }
  };

  const updateBudget = async (id: string, data: CreateBudgetData) => {
    try {
      const budget = await budgetsApi.update(id, data);
      await fetchBudgets();
      ui.notify({
        message: "Budget updated successfully",
        type: "success",
      });
      return budget;
    } catch (error) {
      ui.notify({
        message: "Failed to update budget",
        type: "error",
        error: error as Error,
      });
      return null;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await budgetsApi.delete(id);
      await fetchBudgets();
      ui.notify({
        message: "Budget deleted successfully",
        type: "success",
      });
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to delete budget",
        type: "error",
        error: error as Error,
      });
      return null;
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return {
    budgets,
    isLoading,
    totalBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}
