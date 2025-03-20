export type BudgetItemFrequency = "monthly" | "bi-weekly" | "weekly";

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  account_id: string;
  frequency: BudgetItemFrequency;
  last_paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetItemData {
  id?: string;
  name?: string;
  amount?: number;
  category?: string;
  account_id?: string;
  frequency?: BudgetItem["frequency"];
}

export interface UpdateBudgetItemData extends Partial<CreateBudgetItemData> {}

export interface BudgetItemsByCategory {
  [key: string]: BudgetItem[];
}

export const CATEGORY_COLORS: Record<string, string> = {
  Needs: "#2563eb", // Blue
  Wants: "#dc2626", // Red
  Savings: "#16a34a", // Green
  Debt: "#9333ea", // Purple
  Investment: "#f59e0b", // Amber
};
