import { apiClient } from "./client";
import type { Category } from "../types/categories";

export const categoriesApi = {
  fetchAll: async (): Promise<Category[]> => {
    const response = await apiClient.get("/categories");
    return response.data || [];
  },
};
