import { Insight, MonthlyBalance } from "../types/insights";
import { apiClient } from "./client";

export const insightsApi = {
  // Fetch all insights
  async fetchInsights(): Promise<Insight> {
    try {
      const response = await apiClient.get("/insights");
      return response.data;
    } catch (error) {
      console.error("Error fetching insights:", error);
      throw error;
    }
  },

  async fetchMonthlyBalance(): Promise<MonthlyBalance> {
    try {
      const response = await apiClient.get("/insights/monthly_balance");
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly balance:", error);
      throw error;
    }
  },

  async fetchBudgetUsage() {
    try {
      const response = await apiClient.get("/insights/budget_usage");
      return response.data;
    } catch (error) {
      console.error("Error fetching budget usage:", error);
      throw error;
    }
  }
};
