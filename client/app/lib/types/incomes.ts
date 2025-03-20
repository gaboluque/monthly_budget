import type { Account } from "./accounts";

export type IncomeFrequency =
  | "monthly"
  | "bi-weekly"
  | "weekly"
  | "daily"
  | "yearly"
  | "quarterly";

export interface Income {
  id: string;
  name: string;
  amount: number;
  frequency: IncomeFrequency;
  account_id: string;
  created_at: string;
  updated_at: string;
  last_received_at: string | null;
  account: Account | null;
}

export interface CreateIncomeData {
  name?: string;
  amount?: number;
  frequency?: IncomeFrequency;
  account_id?: string;
}

export interface UpdateIncomeData extends Partial<CreateIncomeData> {}
