import { apiClient } from "./client";

export interface Income {
  id: string;
  name: string;
  amount: number;
  frequency:
    | "monthly"
    | "bi-weekly"
    | "weekly"
    | "daily"
    | "yearly"
    | "quarterly";
  created_at: string;
  updated_at: string;
}

export interface CreateIncomeData {
  name: string;
  amount: number;
  frequency: Income["frequency"];
}

export interface UpdateIncomeData extends Partial<CreateIncomeData> {}

export const incomesApi = {
  // Get all incomes
  getAll: async (): Promise<Income[]> => {
    const response = await apiClient.get("/incomes");
    return response.data;
  },

  // Get a single income by ID
  getById: async (id: string): Promise<Income> => {
    const response = await apiClient.get(`/incomes/${id}`);
    return response.data;
  },

  // Create a new income
  create: async (data: CreateIncomeData): Promise<Income> => {
    const response = await apiClient.post("/incomes", { income: data });
    return response.data;
  },

  // Update an income
  update: async (id: string, data: UpdateIncomeData): Promise<Income> => {
    const response = await apiClient.patch(`/incomes/${id}`, { income: data });
    return response.data;
  },

  // Delete an income
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/incomes/${id}`);
  },
};
