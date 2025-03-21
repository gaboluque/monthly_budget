import { Account } from "./accounts";

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
  is_paid: boolean;
  is_pending: boolean;
  account?: Account;
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
  needs: "#2563eb", // Blue
  wants: "#dc2626", // Red
  savings: "#16a34a", // Green
  debt: "#9333ea", // Purple
  investment: "#f59e0b", // Amber
  income: "#16a34a", // Black
  other: "#6b7280", // Gray
};
