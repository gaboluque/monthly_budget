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

export const CATEGORY_COLORS: Record<string, string> = {
  Needs: "#2563eb", // Blue
  Wants: "#dc2626", // Red
  Savings: "#16a34a", // Green
  Debt: "#9333ea", // Purple
  Investment: "#f59e0b", // Amber
};
