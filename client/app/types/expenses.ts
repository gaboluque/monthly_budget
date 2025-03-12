export type ExpenseFrequency = "monthly" | "bi-weekly" | "weekly";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  destination: string;
  frequency: ExpenseFrequency;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseData {
  name: string;
  amount: number;
  category: string;
  destination: string;
  frequency: ExpenseFrequency;
}

export interface ExpensesByCategory {
  [key: string]: Expense[];
}
