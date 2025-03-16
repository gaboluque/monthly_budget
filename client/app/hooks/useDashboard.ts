import { useState, useEffect } from "react";
import { expensesApi } from "../lib/api/expenses";
import { incomesApi } from "../lib/api/incomes";
import type { Expense } from "../lib/types/expenses";
import { ui } from "../lib/ui/manager";

export function useDashboard() {
  const [pendingExpenses, setPendingExpenses] = useState<Expense[]>([]);
  const [expensedExpenses, setExpensedExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markingExpensed, setMarkingExpensed] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalPendingExpenses: 0,
    balance: 0,
    expenseCategories: 0,
    incomeCount: 0,
    pendingExpensesCount: 0,
    expensesByCategory: {} as Record<string, number>,
  });

  const fetchExpenses = async () => {
    try {
      const [pending, expensed] = await Promise.all([
        expensesApi.getPending(),
        expensesApi.getExpensed(),
      ]);
      setPendingExpenses(pending);
      setExpensedExpenses(expensed);
    } catch (err) {
      ui.notify({
        message: "Failed to load expenses",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummaryData = async () => {
    try {
      // Fetch all expenses and incomes to calculate summary data
      const [pendingExpenses, expenses, incomes] = await Promise.all([
        expensesApi.getPending(),
        expensesApi.getAll(),
        incomesApi.getAll(),
      ]);

      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );
      const totalIncome = incomes.reduce(
        (sum, income) => sum + Number(income.amount),
        0
      );
      const totalPendingExpenses = pendingExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );

      // Calculate expenses by category
      const expensesByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += Number(expense.amount);
        return acc;
      }, {} as Record<string, number>);

      // Get unique categories
      const categories = [
        ...new Set(expenses.map((expense) => expense.category)),
      ];

      setSummaryData({
        totalIncome,
        totalExpenses,
        totalPendingExpenses,
        balance: totalIncome - (totalExpenses - totalPendingExpenses),
        expenseCategories: categories.length,
        incomeCount: incomes.length,
        pendingExpensesCount: pendingExpenses.length,
        expensesByCategory,
      });
    } catch (err) {
      ui.notify({
        message: "Failed to fetch summary data",
        type: "error",
      });
    }
  };

  const handleMarkAsExpensed = async (expenseId: string) => {
    try {
      setMarkingExpensed(expenseId);
      await expensesApi.markAsExpensed(expenseId);
      await fetchExpenses(); // Refresh both lists
      await fetchSummaryData(); // Refresh summary data
    } catch (err) {
      ui.notify({
        message: "Failed to mark expense as expensed",
        type: "error",
      });
    } finally {
      setMarkingExpensed(null);
    }
  };

  const handleUnmarkAsExpensed = async (expenseId: string) => {
    try {
      setMarkingExpensed(expenseId);
      await expensesApi.unmarkAsExpensed(expenseId);
      await fetchExpenses(); // Refresh both lists
      await fetchSummaryData(); // Refresh summary data
    } catch (err) {
      ui.notify({
        message: "Failed to unmark expense",
        type: "error",
      });
    } finally {
      setMarkingExpensed(null);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummaryData();
  }, []);

  return {
    pendingExpenses,
    expensedExpenses,
    isLoading,
    markingExpensed,
    summaryData,
    handleMarkAsExpensed,
    handleUnmarkAsExpensed,
  };
}
