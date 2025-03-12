import { useState, useEffect, useMemo } from "react";
import { expensesApi } from "../lib/api/expenses";
import type {
  Expense,
  CreateExpenseData,
  ExpensesByCategory,
} from "../types/expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
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
      setError("Failed to fetch expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await expensesApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const createExpense = async (data: CreateExpenseData) => {
    try {
      await expensesApi.create(data);
      await fetchExpenses();
      return true;
    } catch (error) {
      setError("Failed to create expense");
      return false;
    }
  };

  const updateExpense = async (id: string, data: CreateExpenseData) => {
    try {
      await expensesApi.update(id, data);
      await fetchExpenses();
      return true;
    } catch (error) {
      setError("Failed to update expense");
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expensesApi.delete(id);
      await fetchExpenses();
      return true;
    } catch (error) {
      setError("Failed to delete expense");
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
    error,
    isLoading,
    totalExpenses,
    expensesByCategory,
    createExpense,
    updateExpense,
    deleteExpense,
    clearError: () => setError(null),
  };
}
