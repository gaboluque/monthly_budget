export type Insight = string;

export type CategoryData = {
  budget_amount: string | number;
  monthly_expenses: string | number;
  remaining: string | number;
  percentage_used: string | number;
  status: string;
};

export type MonthlyBalance = {
  incomes: {
    total: string;
    transactions: Transaction[];
  };
  expenses: {
    total: string;
    transactions: Transaction[];
  };
  monthly_balance: string;
  balance_by_category: Record<string, CategoryData>;
};

type Transaction = {
  id: number;
  user_id: number;
  account_id: number;
  recipient_account_id: number | null;
  amount: string;
  transaction_type: 'income' | 'expense';
  description: string | null;
  executed_at: string;
  created_at: string;
  updated_at: string;
  item_type: string | null;
  item_id: number | null;
  frequency: string;
  category: string;
  budget_item_id: number;
};
