import { Insight, MonthlyBalance } from "../types/insights";
import { apiClient } from "./client";
import { getEnv } from "../utils/getEnv";
export const insightsApi = {
  // Get all insights
  getAll: async (): Promise<Insight> => {
    const response = await apiClient.get("/insights");
    return response.data;
  },

  getMonthlyBalance: async (): Promise<MonthlyBalance> => {
    console.log("getMonthlyBalance", getEnv().BASE_API_URL);
    const response = await apiClient.get("/insights/monthly_balance");
    return response.data;
  },
};
