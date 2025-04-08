import { Insight, MonthlyBalance } from "../types/insights";
import { apiClient } from "./client";

export const insightsApi = {
  // Fetch all insights
  fetchAll: async (): Promise<Insight> => {
    const response = await apiClient.get("/insights");
    return response.data;
  },

  fetchMonthlyBalance: async (): Promise<MonthlyBalance> => {
    const response = await apiClient.get("/insights/monthly_balance");
    return response.data;
  },
};
