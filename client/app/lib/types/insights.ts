import { Income } from "./incomes";
import { Transaction } from "./transactions";
export type Insight = string;

export type MonthlyBalance = {
  incomes: Income[];
  expenses: Transaction[];
  balance: number;
};
