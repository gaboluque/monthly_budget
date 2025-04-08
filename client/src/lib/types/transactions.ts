import { Account } from "./accounts";
import { TransactionCategory } from "./transaction_categories";
export interface Transaction {
  id: string;
  account_id: string;
  recipient_account_id?: string;
  amount: number;
  transaction_type: string;
  description: string;
  executed_at: string;
  frequency: string;
  account?: Account;
  created_at: string;
  updated_at: string;
  recipient_account_name?: string;
  recipient_account?: Account;
  category?: TransactionCategory;
}

export type TransactionType = string;

export interface TransactionsFilterParams {
  account_id?: string;
  transaction_type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  frequency?: string;
  category?: string;
  page?: number;
  per_page?: number;
}

export interface CreateTransactionData {
  account_id: string;
  recipient_account_id?: string;
  amount: number;
  transaction_type: string;
  description?: string;
  executed_at?: string;
  frequency?: string;
  category_id?: string;
}