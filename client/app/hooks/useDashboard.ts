import { useState, useEffect } from "react";
import { budgetItemsApi } from "../lib/api/budget_items";
import { incomesApi } from "../lib/api/incomes";
import type { BudgetItem } from "../lib/types/budget_items";
import { ui } from "../lib/ui/manager";
import { Income } from "../lib/types/incomes";

export function useDashboard() {
  const [pendingBudgetItems, setPendingBudgetItems] = useState<BudgetItem[]>(
    []
  );
  const [paidBudgetItems, setPaidBudgetItems] = useState<BudgetItem[]>([]);
  const [pendingIncomes, setPendingIncomes] = useState<Income[]>([]);
  const [receivedIncomes, setReceivedIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markingBudgetItemPending, setMarkingBudgetItemPending] = useState<
    string | null
  >(null);
  const [markingBudgetItemPaid, setMarkingBudgetItemPaid] = useState<
    string | null
  >(null);
  const [markingIncomePending, setMarkingIncomePending] = useState<
    string | null
  >(null);
  const [markingIncomeReceived, setMarkingIncomeReceived] = useState<
    string | null
  >(null);
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalBudgetItems: 0,
    totalPendingBudgetItems: 0,
    balance: 0,
    budgetItemCategories: 0,
    incomeCount: 0,
    pendingBudgetItemsCount: 0,
    budgetItemsByCategory: {} as Record<string, number>,
  });

  const fetchBudgetItems = async () => {
    try {
      const [pending, paid] = await Promise.all([
        budgetItemsApi.getPending(),
        budgetItemsApi.getPaid(),
      ]);
      setPendingBudgetItems(pending);
      setPaidBudgetItems(paid);
    } catch (err) {
      ui.notify({
        message: "Failed to load budget items",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummaryData = async () => {
    try {
      // Fetch all budget items and incomes to calculate summary data
      const [pendingBudgetItems, budgetItems, incomes] = await Promise.all([
        budgetItemsApi.getPending(),
        budgetItemsApi.getAll(),
        incomesApi.getAll(),
      ]);

      const totalBudgetItems = budgetItems.reduce(
        (sum, budgetItem) => sum + Number(budgetItem.amount),
        0
      );
      const totalPendingBudgetItems = pendingBudgetItems.reduce(
        (sum, budgetItem) => sum + Number(budgetItem.amount),
        0
      );

      const { pendingIncomes, receivedIncomes } = incomes.reduce(
        (acc, income) => {
          if (!income.last_received_at) {
            acc.pendingIncomes.push(income);
          } else {
            acc.receivedIncomes.push(income);
          }
          return acc;
        },
        { pendingIncomes: [] as Income[], receivedIncomes: [] as Income[] }
      );

      const totalIncome = receivedIncomes.reduce(
        (sum, income) => sum + Number(income.amount),
        0
      );

      setPendingIncomes(pendingIncomes);
      setReceivedIncomes(receivedIncomes);

      // Calculate budget items by category
      const budgetItemsByCategory = budgetItems.reduce((acc, budgetItem) => {
        if (!acc[budgetItem.category]) {
          acc[budgetItem.category] = 0;
        }
        acc[budgetItem.category] += Number(budgetItem.amount);
        return acc;
      }, {} as Record<string, number>);

      // Get unique categories
      const categories = [
        ...new Set(budgetItems.map((budgetItem) => budgetItem.category)),
      ];

      setSummaryData({
        totalIncome,
        totalBudgetItems,
        totalPendingBudgetItems,
        balance: totalIncome - (totalBudgetItems - totalPendingBudgetItems),
        budgetItemCategories: categories.length,
        incomeCount: incomes.length,
        pendingBudgetItemsCount: pendingBudgetItems.length,
        budgetItemsByCategory,
      });
    } catch (err) {
      ui.notify({
        message: "Failed to fetch summary data",
        type: "error",
        error: err,
      });
    }
  };

  const handleMarkBudgetItemAsPaid = async (budgetItemId: string) => {
    try {
      setMarkingBudgetItemPaid(budgetItemId);
      await budgetItemsApi.markAsPaid(budgetItemId);
      await fetchBudgetItems(); // Refresh both lists
      await fetchSummaryData(); // Refresh summary data
    } catch (err) {
      ui.notify({
        message: "Failed to mark budget item as paid",
        type: "error",
      });
    } finally {
      setMarkingBudgetItemPaid(null);
    }
  };

  const handleMarkBudgetItemAsPending = async (budgetItemId: string) => {
    try {
      setMarkingBudgetItemPending(budgetItemId);
      await budgetItemsApi.markAsPending(budgetItemId);
      await fetchBudgetItems(); // Refresh both lists
      await fetchSummaryData(); // Refresh summary data
    } catch (err) {
      ui.notify({
        message: "Failed to mark budget item as pending",
        type: "error",
      });
    } finally {
      setMarkingBudgetItemPending(null);
    }
  };

  const handleMarkIncomeAsReceived = async (incomeId: string) => {
    try {
      setMarkingIncomeReceived(incomeId);
      await incomesApi.markAsReceived(incomeId);
      await fetchSummaryData(); // Refresh summary data
    } catch (err) {
      ui.notify({
        message: "Failed to mark income as received",
        type: "error",
      });
    } finally {
      setMarkingIncomeReceived(null);
    }
  };

  const handleMarkIncomeAsPending = async (incomeId: string) => {
    try {
      setMarkingIncomePending(incomeId);
      await incomesApi.markAsPending(incomeId);
      await fetchSummaryData(); // Refresh summary data
    } catch (err) {
      ui.notify({
        message: "Failed to mark income as pending",
        type: "error",
      });
    } finally {
      setMarkingIncomePending(null);
    }
  };

  useEffect(() => {
    fetchBudgetItems();
    fetchSummaryData();
  }, []);

  return {
    pendingBudgetItems,
    paidBudgetItems,
    pendingIncomes,
    receivedIncomes,
    isLoading,
    markingBudgetItemPending,
    markingBudgetItemPaid,
    markingIncomePending,
    markingIncomeReceived,
    summaryData,
    handleMarkBudgetItemAsPending,
    handleMarkBudgetItemAsPaid,
    handleMarkIncomeAsReceived,
    handleMarkIncomeAsPending,
  };
}
