import { useState, useEffect } from "react";
import { insightsApi } from "../lib/api/insights";
import { MonthlyBalance } from "../lib/types/insights";

export function useDashboard() {
  const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalance | null>(null);
  const [monthlyBalanceLoading, setMonthlyBalanceLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyBalance = async () => {
      const response = await insightsApi.getMonthlyBalance();
      setMonthlyBalance(response);
      setMonthlyBalanceLoading(false);
    };

    fetchMonthlyBalance();
  }, []);

  return { monthlyBalance, monthlyBalanceLoading }
}
