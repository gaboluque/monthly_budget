import {
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
} from "../types/expenses";
import { apiClient } from "./client";

export const expensesApi = {
  // Get all expenses
  getAll: async (): Promise<Expense[]> => {
    const response = await apiClient.get("/expenses");
    return response.data;
  },

  // Get a single expense by ID
  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  // Create a new expense
  create: async (data: CreateExpenseData): Promise<Expense> => {
    const response = await apiClient.post("/expenses", { expense: data });
    return response.data;
  },

  // Update an expense
  update: async (id: string, data: UpdateExpenseData): Promise<Expense> => {
    const response = await apiClient.patch(`/expenses/${id}`, {
      expense: data,
    });
    return response.data;
  },

  // Delete an expense
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
  },

  // Get available categories
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get("/expenses/categories");
    return response.data;
  },

  // Get pending expenses
  getPending: async (): Promise<Expense[]> => {
    const response = await apiClient.get("/expenses/pending");
    return response.data;
  },

  // Get expensed expenses
  getExpensed: async (): Promise<Expense[]> => {
    const response = await apiClient.get("/expenses/expensed");
    return response.data;
  },

  // Mark expense as expensed
  markAsExpensed: async (id: string): Promise<Expense> => {
    const response = await apiClient.post(`/expenses/${id}/mark_as_expensed`);
    return response.data;
  },

  // Unmark expense as expensed
  unmarkAsExpensed: async (id: string): Promise<Expense> => {
    const response = await apiClient.post(`/expenses/${id}/unmark_as_expensed`);
    return response.data;
  },
};
