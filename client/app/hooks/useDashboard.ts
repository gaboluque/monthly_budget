import { useState, useEffect } from "react";
import { incomesApi } from "../lib/api/incomes";
import { ui } from "../lib/ui/manager";
import { Income } from "../lib/types/incomes";
import { insightsApi } from "../lib/api/insights";
import { MonthlyBalance } from "../lib/types/insights";

export function useDashboard() {
  const [pendingIncomes, setPendingIncomes] = useState<Income[]>([]);
  const [receivedIncomes, setReceivedIncomes] = useState<Income[]>([]);
  const [incomesLoading, setIncomesLoading] = useState(true);
  const [markingIncomePending, setMarkingIncomePending] = useState<
    string | null
  >(null);
  const [markingIncomeReceived, setMarkingIncomeReceived] = useState<
    string | null
  >(null);

  const [monthlyBalanceLoading, setMonthlyBalanceLoading] = useState(true);
  const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalance>({
    incomes: [],
    expenses: [],
    balance: 0,
  });

  const fetchIncomes = async () => {
    setIncomesLoading(true);
    const [pending, received] = await Promise.all([
      incomesApi.getPending(),
      incomesApi.getReceived(),
    ]);
    setPendingIncomes(pending);
    setReceivedIncomes(received);
    setIncomesLoading(false);
  };

  const fetchMonthlyBalance = async () => {
    setMonthlyBalanceLoading(true);
    const balance = await insightsApi.getMonthlyBalance();
    setMonthlyBalance(balance);
    setMonthlyBalanceLoading(false);
  };

  useEffect(() => {
    fetchIncomes();
    fetchMonthlyBalance();
  }, []);

  const handleMarkIncomeAsReceived = async (incomeId: string) => {
    try {
      setMarkingIncomeReceived(incomeId);
      await incomesApi.markAsReceived(incomeId);
    } catch (err) {
      ui.notify({
        message: "Failed to mark income as received",
        type: "error",
      });
    } finally {
      setMarkingIncomeReceived(null);
      fetchIncomes();
    }
  };

  const handleMarkIncomeAsPending = async (incomeId: string) => {
    try {
      setMarkingIncomePending(incomeId);
      await incomesApi.markAsPending(incomeId);
    } catch (err) {
      ui.notify({
        message: "Failed to mark income as pending",
        type: "error",
      });
    } finally {
      setMarkingIncomePending(null);
      fetchIncomes();
    }
  };

  return {
    pendingIncomes,
    receivedIncomes,
    incomesLoading,
    markingIncomePending,
    markingIncomeReceived,
    handleMarkIncomeAsReceived,
    handleMarkIncomeAsPending,
    monthlyBalance,
    monthlyBalanceLoading,
  };
}
