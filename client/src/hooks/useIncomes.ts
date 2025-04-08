import { useState, useEffect, useMemo, useCallback } from "react";
import { incomesApi } from "../lib/api/incomes";
import type { Income, CreateIncomeData } from "../lib/types/incomes";
import { ui } from "../lib/ui/manager";

export function useIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [pendingIncomes, setPendingIncomes] = useState<Income[]>([]);
  const [receivedIncomes, setReceivedIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markingReceived, setMarkingReceived] = useState<string | null>(null);

  const totalIncome = useMemo(() => {
    if (incomes.length === 0) return 0;
    return incomes.reduce((acc, income) => acc + Number(income.amount), 0);
  }, [incomes]);

  const fetchIncomes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await incomesApi.fetchAll();
      setIncomes(data);

      // Filter pending and received incomes
      const pending = data.filter((income) => !income.last_received_at);
      const received = data.filter((income) => income.last_received_at);

      setPendingIncomes(pending);
      setReceivedIncomes(received);
    } catch (error) {
      ui.notify({
        message: "Failed to fetch incomes",
        type: "error",
        error: error as Error,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createIncome = async (data: CreateIncomeData) => {
    try {
      await incomesApi.create(data);
      await fetchIncomes();
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to create income",
        type: "error",
        error: error as Error,
      });
      return false;
    }
  };

  const updateIncome = async (id: string, data: CreateIncomeData) => {
    try {
      await incomesApi.update(id, data);
      await fetchIncomes();
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to update income",
        type: "error",
        error: error as Error,
      });
      return false;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await incomesApi.delete(id);
      await fetchIncomes();
      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to delete income",
        type: "error",
        error: error as Error,
      });
      return false;
    }
  };

  const handleMarkAsReceived = useCallback(
    async (id: string) => {
      setMarkingReceived(id);
      try {
        await incomesApi.markAsReceived(id);
        ui.notify({
          message: "Income marked as received",
          type: "success",
        });
        fetchIncomes();
      } catch (error) {
        console.error("Error marking income as received:", error);
        ui.notify({
          message: "Failed to mark income as received",
          type: "error",
        });
      } finally {
        setMarkingReceived(null);
      }
    },
    [fetchIncomes]
  );

  const handleUnmarkAsReceived = useCallback(
    async (id: string) => {
      setMarkingReceived(id);
      try {
        await incomesApi.markAsPending(id);
        ui.notify({
          message: "Income marked as pending",
          type: "success",
        });
        fetchIncomes();
      } catch (error) {
        console.error("Error unmarking income as received:", error);
        ui.notify({
          message: "Failed to mark income as pending",
          type: "error",
        });
      } finally {
        setMarkingReceived(null);
      }
    },
    [fetchIncomes]
  );

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  return {
    incomes,
    pendingIncomes,
    receivedIncomes,
    isLoading,
    totalIncome,
    markingReceived,
    createIncome,
    updateIncome,
    deleteIncome,
    handleMarkAsReceived,
    handleUnmarkAsReceived,
  };
}
