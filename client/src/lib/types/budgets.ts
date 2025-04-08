export interface Budget {
  id: string;
  name: string;
  amount: number;
  last_paid_at?: string;
  created_at: string;
  updated_at: string;
  is_paid: boolean;
  is_pending: boolean;
}

export interface CreateBudgetData {
  id?: string;
  name?: string;
  amount?: number;
}

// Define explicit fields for clarity even though it's a partial
export interface UpdateBudgetData {
  id?: string;
  name?: string;
  amount?: number;
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
