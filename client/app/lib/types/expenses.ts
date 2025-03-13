export type ExpenseFrequency = "monthly" | "bi-weekly" | "weekly";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  destination: string;
  frequency: ExpenseFrequency;
  last_expensed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseData {
  name: string;
  amount: number;
  category: string;
  destination: string;
  frequency: Expense["frequency"];
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {}

export interface ExpensesByCategory {
  [key: string]: Expense[];
}
