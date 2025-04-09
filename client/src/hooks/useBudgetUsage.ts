import { useState, useEffect } from "react";
import { insightsApi } from "../lib/api/insights";
import { ui } from "../lib/ui/manager";

export type BudgetUsageItem = {
  id: string;
  name: string;
  amount: number;
  usage_amount: number;
  nature: string;
  percentage: number;
};

export function useBudgetUsage() {
  const [budgetsUsage, setBudgetsUsage] = useState<Record<string, BudgetUsageItem>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchBudgetUsage = async () => {
    try {
      setIsLoading(true);
      const data = await insightsApi.fetchBudgetUsage();
      setBudgetsUsage(data);
    } catch (error) {
      ui.notify({
        message: "Failed to fetch budget usage data",
        type: "error",
        error: error as Error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetUsage();
  }, []);

  return {
    budgetsUsage,
    isLoading,
    fetchBudgetUsage,
  };
} 