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
  need: "blue", // Blue
  want: "red", // Red
  debt: "purple", // Purple
  saving: "green", // Green
  investment: "amber", // Amber
  income: "black", // Black
  other: "gray", // Gray
};
