import { apiClient } from "./client";
import type { TransactionCategory } from "../types/categories";

export const categoriesApi = {
  fetchAll: async (): Promise<TransactionCategory[]> => {
    const response = await apiClient.get("/categories");
    return response.data || [];
  },
};
