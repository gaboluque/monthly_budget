import { apiClient } from "./client";
import {
  Account,
  CreateAccountData,
  UpdateAccountData,
  AccountType,
  Currency,
} from "../types/accounts";

export const accountsApi = {
  // Get all accounts
  getAll: async (): Promise<Account[]> => {
    const response = await apiClient.get("/accounts");
    return response.data;
  },

  // Get a single account by ID
  getById: async (id: string): Promise<Account> => {
    const response = await apiClient.get(`/accounts/${id}`);
    return response;
  },

  // Create a new account
  create: async (data: CreateAccountData): Promise<Account> => {
    const response = await apiClient.post("/accounts", { account: data });
    return response;
  },

  // Update an account
  update: async (id: string, data: UpdateAccountData): Promise<Account> => {
    const response = await apiClient.patch(`/accounts/${id}`, {
      account: data,
    });
    return response;
  },

  // Delete an account
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/accounts/${id}`);
  },

  // Get available account types
  getAccountTypes: async (): Promise<AccountType[]> => {
    const response = await apiClient.get("/accounts/types");
    return response.data;
  },

  // Get available currencies
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get("/accounts/currencies");
    return response.data;
  },
};
