import { Account } from "./accounts";
import { Budget } from "./budgets";
import { Income } from "./incomes";

export type OnboardingData = {
  accounts: Account[];
  incomes: Income[];
  budgets: Budget[];
};
