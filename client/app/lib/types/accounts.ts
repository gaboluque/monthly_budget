export type AccountType =
  | "Checking"
  | "Savings"
  | "Credit Card"
  | "Loan"
  | "Investment"
  | "Other";

export type Currency = "COP" | "USD" | "EUR";

export interface Account {
  id: string;
  name: string;
  balance: number;
  account_type: AccountType;
  currency: Currency;
  description?: string;
  is_owned: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountData {
  name: string;
  balance: number;
  account_type: AccountType;
  currency: Currency;
  description?: string;
  is_owned?: boolean;
}

export interface UpdateAccountData extends Partial<CreateAccountData> {}
