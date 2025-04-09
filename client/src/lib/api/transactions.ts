import { apiClient } from "./client";
import type {
  Transaction,
  TransactionType,
  TransactionsFilterParams,
  CreateTransactionData,
} from "../types/transactions";

export const transactionsApi = {
  fetchAll: async (params?: TransactionsFilterParams): Promise<Transaction[]> => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await apiClient.get(`/transactions${query}`);

    return response.data || [];
  },

  fetchById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response;
  },

  create: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post("/transactions", {
      transaction: data,
    });
    return response;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  fetchTypes: async (): Promise<TransactionType[]> => {
    const response = await apiClient.get("/transactions/types");
    return response.types || [];
  },
};
