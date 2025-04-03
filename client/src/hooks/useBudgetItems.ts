import { useState, useEffect, useMemo } from "react";
import type {
  BudgetItemsByCategory,
  BudgetItem,
  CreateBudgetItemData,
} from "../lib/types/budget_items";
import { ui } from "../lib/ui/manager";
import { budgetItemsApi } from "../lib/api/budget_items";

export function useBudgetItems() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalBudgetItems = useMemo(() => {
    if (budgetItems.length === 0) return 0;
    return budgetItems.reduce(
      (acc, budgetItem) => acc + Number(budgetItem.amount),
      0
    );
  }, [budgetItems]);

  const budgetItemsByCategory = useMemo(() => {
    return budgetItems.reduce((acc, budgetItem) => {
      if (!acc[budgetItem.category]) {
        acc[budgetItem.category] = [];
      }
      acc[budgetItem.category].push(budgetItem);
      return acc;
    }, {} as BudgetItemsByCategory);
  }, [budgetItems]);

  const fetchBudgetItems = async () => {
    try {
      const data = await budgetItemsApi.getAll();
      setBudgetItems(data);
    } catch (error) {
      ui.notify({
        message: "Failed to fetch budget items",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await budgetItemsApi.getCategories();
      setCategories(data);
    } catch (error) {
      ui.notify({
        message: "Failed to fetch categories",
        type: "error",
      });
    }
  };

  const createBudgetItem = async (data: CreateBudgetItemData) => {
    try {
      const budgetItem = await budgetItemsApi.create(data);
      await fetchBudgetItems();
      ui.notify({
        message: "Budget item created successfully",
        type: "success",
      });
      return budgetItem;
    } catch (error) {
      ui.notify({
        message: "Failed to create budget item",
        type: "error",
      });
      return null;
    }
  };

  const updateBudgetItem = async (id: string, data: CreateBudgetItemData) => {
    try {
      const budgetItem = await budgetItemsApi.update(id, data);
      await fetchBudgetItems();
      ui.notify({
        message: "Budget item updated successfully",
        type: "success",
      });
      return budgetItem;
    } catch (error) {
      ui.notify({
        message: "Failed to update budget item",
        type: "error",
      });
      return null;
    }
  };

  const deleteBudgetItem = async (id: string) => {
    try {
      await budgetItemsApi.delete(id);
      await fetchBudgetItems();
      ui.notify({
        message: "Budget item deleted successfully",
        type: "success",
      });
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to delete budget item",
        type: "error",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchBudgetItems();
    fetchCategories();
  }, []);

  return {
    budgetItems,
    categories,
    isLoading,
    totalBudgetItems,
    budgetItemsByCategory,
    createBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
  };
}
