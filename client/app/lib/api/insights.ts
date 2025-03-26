import { Insight, MonthlyBalance } from "../types/insights";
import { apiClient } from "./client";

export const insightsApi = {
  // Get all insights
  getAll: async (): Promise<Insight> => {
    const response = await apiClient.get("/insights");
    return response.data;
  },

  getMonthlyBalance: async (): Promise<MonthlyBalance> => {
    const response = await apiClient.get("/insights/monthly_balance");
    return response.data;
  },
};
