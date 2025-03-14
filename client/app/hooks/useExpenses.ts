import { useState, useEffect, useMemo } from "react";
import { expensesApi } from "../lib/api/expenses";
import type {
  Expense,
  CreateExpenseData,
  ExpensesByCategory,
} from "../lib/types/expenses";
import { ui } from "../lib/ui/manager";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalExpenses = useMemo(() => {
    if (expenses.length === 0) return 0;
    return expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
  }, [expenses]);

  const expensesByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = [];
      }
      acc[expense.category].push(expense);
      return acc;
    }, {} as ExpensesByCategory);
  }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const data = await expensesApi.getAll();
      setExpenses(data);
    } catch (error) {
      ui.notify({
        message: "Failed to fetch expenses",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await expensesApi.getCategories();
      setCategories(data);
    } catch (error) {
      ui.notify({
        message: "Failed to fetch categories",
        type: "error",
      });
    }
  };

  const createExpense = async (data: CreateExpenseData) => {
    try {
      await expensesApi.create(data);
      await fetchExpenses();
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to create expense",
        type: "error",
      });
      return false;
    }
  };

  const updateExpense = async (id: string, data: CreateExpenseData) => {
    try {
      await expensesApi.update(id, data);
      await fetchExpenses();
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to update expense",
        type: "error",
      });
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expensesApi.delete(id);
      await fetchExpenses();
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to delete expense",
        type: "error",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  return {
    expenses,
    categories,
    isLoading,
    totalExpenses,
    expensesByCategory,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
