export interface Transaction {
  id: string;
  account_id: string;
  recipient_account_id?: string;
  amount: number;
  transaction_type: string;
  description: string;
  executed_at: string;
  created_at: string;
  updated_at: string;
  account_name?: string;
  recipient_account_name?: string;
}

export interface TransactionType {
  id: string;
  name: string;
}

export interface TransactionsFilterParams {
  account_id?: string;
  transaction_type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  per_page?: number;
}
