import { apiClient } from "./client";
import { Income, CreateIncomeData, UpdateIncomeData } from "../types/incomes";

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

  // Get pending incomes
  getPending: async (): Promise<Income[]> => {
    const response = await apiClient.get("/incomes/pending");
    return response.data;
  },

  // Get received incomes
  getReceived: async (): Promise<Income[]> => {
    const response = await apiClient.get("/incomes/received");
    return response.data;
  },

  // Mark an income as received
  markAsReceived: async (id: string): Promise<Income> => {
    const response = await apiClient.put(`/incomes/${id}/mark_as_received`);
    return response.data;
  },

  // Unmark an income as received
  markAsPending: async (id: string): Promise<Income> => {
    const response = await apiClient.put(`/incomes/${id}/mark_as_pending`);
    return response.data;
  },
};
