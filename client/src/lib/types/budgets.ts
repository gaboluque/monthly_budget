export interface Budget {
  id: string;
  name: string;
  amount: number;
  last_paid_at?: string;
  created_at: string;
  updated_at: string;
  is_paid: boolean;
  is_pending: boolean;
  nature?: string;
}

export interface CreateBudgetData {
  id?: string;
  name?: string;
  amount?: number;
  nature?: string;
}

// Define explicit fields for clarity even though it's a partial
export interface UpdateBudgetData {
  id?: string;
  name?: string;
  amount?: number;
  nature?: string;
}

export const NATURE_COLORS: Record<string, string> = {
  need: "#2563eb", // Blue
  want: "#dc2626", // Red
  debt: "#9333ea", // Purple
  saving: "#16a34a", // Green
  investment: "#f59e0b", // Amber
  income: "#16a34a", // Black
  other: "#6b7280", // Gray
};
