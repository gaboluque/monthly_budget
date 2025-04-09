import { Transaction } from "../types/transactions";

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatLabel(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, " ");
}

export function formatISODate(dateString: string): string {
  return new Date(dateString).toISOString().split("T")[0];
}

export function formatTransaction(transaction: Transaction): string {
  const sign = transaction.transaction_type === "income" ? "+" : transaction.transaction_type === "expense" ? "-" : "";
  return `${sign}${formatCurrency(transaction.amount)}`;
}

export function formatAccountType(accountType: string): string {
  return accountType.split("_").join(" ").charAt(0).toUpperCase() + accountType.split("_").join(" ").slice(1);
}
