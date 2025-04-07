export interface TransactionCategory {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  transaction_categories?: TransactionCategory[];
  transaction_category_ids?: number[];
  last_paid_at?: string;
  created_at: string;
  updated_at: string;
  is_paid: boolean;
  is_pending: boolean;
}

export interface CreateBudgetItemData {
  id?: string;
  name?: string;
  amount?: number;
  transaction_category_ids?: number[];
}

// Define explicit fields for clarity even though it's a partial
export interface UpdateBudgetItemData {
  id?: string;
  name?: string;
  amount?: number;
  transaction_category_ids?: number[];
}

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
