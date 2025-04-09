import { apiClient } from "./client";
import {
  Account,
  CreateAccountData,
  UpdateAccountData,
  AccountType,
  Currency,
} from "../types/accounts";

export const accountsApi = {
  // Fetch all accounts
  fetchAll: async (): Promise<Account[]> => {
    const response = await apiClient.get("/accounts");
    return response.data;
  },

  // Fetch a single account by ID
  fetchById: async (id: string): Promise<Account> => {
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

  // Fetch available account types
  fetchAccountTypes: async (): Promise<AccountType[]> => {
    const response = await apiClient.get("/accounts/types");
    return response.data;
  },

  // Fetch available currencies
  fetchCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get("/accounts/currencies");
    return response.data;
  },
};
