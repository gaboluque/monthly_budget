import { apiClient } from "./client";
import type {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionType,
  TransactionsFilterParams,
} from "../types/transactions";

export const transactionsApi = {
  getAll: async (params?: TransactionsFilterParams): Promise<Transaction[]> => {
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

  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response;
  },

  create: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post("/transactions", {
      transaction: data,
    });
    return response;
  },

  update: async (
    id: string,
    data: UpdateTransactionData
  ): Promise<Transaction> => {
    const response = await apiClient.patch(`/transactions/${id}`, {
      transaction: data,
    });
    return response;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  getTypes: async (): Promise<TransactionType[]> => {
    const response = await apiClient.get("/transactions/types");
    return response.types || [];
  },
};
