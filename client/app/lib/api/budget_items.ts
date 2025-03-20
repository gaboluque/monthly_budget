import {
  BudgetItem,
  CreateBudgetItemData,
  UpdateBudgetItemData,
} from "../types/budget_items";
import { apiClient } from "./client";

export const budgetItemsApi = {
  // Get all budget items
  getAll: async (): Promise<BudgetItem[]> => {
    const response = await apiClient.get("/budget_items");
    return response.data;
  },

  // Get a single budget item by ID
  getById: async (id: string): Promise<BudgetItem> => {
    const response = await apiClient.get(`/budget_items/${id}`);
    return response;
  },

  // Create a new budget item
  create: async (data: CreateBudgetItemData): Promise<BudgetItem> => {
    const response = await apiClient.post("/budget_items", {
      budget_item: data,
    });
    return response;
  },

  // Update a budget item
  update: async (
    id: string,
    data: UpdateBudgetItemData
  ): Promise<BudgetItem> => {
    const response = await apiClient.patch(`/budget_items/${id}`, {
      budget_item: data,
    });
    return response;
  },

  // Delete a budget item
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budget_items/${id}`);
  },

  // Get available categories
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get("/budget_items/categories");
    return response.data;
  },

  // Get pending budget items
  getPending: async (): Promise<BudgetItem[]> => {
    const response = await apiClient.get("/budget_items/pending");
    return response.data;
  },

  // Get paid budget items
  getPaid: async (): Promise<BudgetItem[]> => {
    const response = await apiClient.get("/budget_items/paid");
    return response.data;
  },

  // Mark budget item as paid
  markAsPaid: async (id: string): Promise<BudgetItem> => {
    const response = await apiClient.put(`/budget_items/${id}/mark_as_paid`);
    return response.data;
  },

  // Mark budget item as pending
  markAsPending: async (id: string): Promise<BudgetItem> => {
    const response = await apiClient.put(`/budget_items/${id}/mark_as_pending`);
    return response.data;
  },
};
