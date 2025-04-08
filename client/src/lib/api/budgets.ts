import {
  Budget,
  CreateBudgetData,
  UpdateBudgetData,
} from "../types/budgets";
import { apiClient } from "./client";

export const budgetsApi = {
  // Get all budgets
  getAll: async (): Promise<Budget[]> => {
    const response = await apiClient.get("/budgets");
    return response.data;
  },

  // Get a single budget item by ID
  getById: async (id: string): Promise<Budget> => {
    const response = await apiClient.get(`/budgets/${id}`);
    return response;
  },

  // Create a new budget item
  create: async (data: CreateBudgetData): Promise<Budget> => {
    const response = await apiClient.post("/budgets", {
      budget: data,
    });
    return response;
  },

  // Update a budget item
  update: async (
    id: string,
    data: UpdateBudgetData
  ): Promise<Budget> => {
    const response = await apiClient.patch(`/budgets/${id}`, {
      budget: data,
    });
    return response;
  },

  // Delete a budget item
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },

  // Get available categories
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get("/budgets/categories");
    return response.data;
  },

  // Get pending budget items
  getPending: async (): Promise<Budget[]> => {
    const response = await apiClient.get("/budgets/pending");
    return response.data;
  },

  // Get paid budget items
  getPaid: async (): Promise<Budget[]> => {
    const response = await apiClient.get("/budgets/paid");
    return response.data;
  },

  // Mark budget item as paid
  markAsPaid: async (id: string): Promise<Budget> => {
    const response = await apiClient.put(`/budgets/${id}/mark_as_paid`);
    return response.data;
  },

  // Mark budget item as pending
  markAsPending: async (id: string): Promise<Budget> => {
    const response = await apiClient.put(`/budgets/${id}/mark_as_pending`);
    return response.data;
  },
};
