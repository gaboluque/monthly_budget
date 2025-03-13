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
  created_at: string;
  updated_at: string;
}

export interface CreateIncomeData {
  name: string;
  amount: number;
  frequency: IncomeFrequency;
}

export interface UpdateIncomeData extends Partial<CreateIncomeData> {}
