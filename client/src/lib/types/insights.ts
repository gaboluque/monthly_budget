export type Insight = string;

export type MonthlyBalance = {
  monthly_balance: string;
  incomes: {
    total: string;
  };
  expenses: {
    total: string;
  };
};