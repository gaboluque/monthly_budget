import { OptionSelectProps } from "../../components/forms/fields/OptionSelect";
import { Category } from "../types/categories";
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


export function formatCategoriesToOptions(categories: Category[]): OptionSelectProps<Category>["options"] {
  return categories.map((category: Category) => ({
    label: `${category.icon} ${category.name}`,
    value: category.id,
    children: category.children.map((child: Category) => ({
      label: `${child.icon} ${child.name}`,
      value: child.id,
    })),
  }));
}

export function percentageToColor(percentage: number): string {
  if (percentage < 50) return "limegreen";
  if (percentage < 75) return "yellow";
  return "red";
}
