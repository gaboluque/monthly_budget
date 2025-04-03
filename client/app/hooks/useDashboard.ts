import { useState, useEffect } from "react";
import { insightsApi } from "../lib/api/insights";
import { MonthlyBalance } from "../lib/types/insights";
import { getEnv } from "../lib/utils/getEnv";

export function useDashboard() {
  const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalance | null>(null);
  const [monthlyBalanceLoading, setMonthlyBalanceLoading] = useState(true);

  console.log("useDashboard", getEnv().BASE_API_URL);

  useEffect(() => {
    const fetchMonthlyBalance = async () => {
      console.log("fetchMonthlyBalance", getEnv().BASE_API_URL);
      const response = await insightsApi.getMonthlyBalance();
      setMonthlyBalance(response);
      setMonthlyBalanceLoading(false);
    };

    fetchMonthlyBalance();
  }, []);

  return { monthlyBalance, monthlyBalanceLoading }
}
