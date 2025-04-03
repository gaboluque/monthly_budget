import {
  Home,
  DollarSign,
  CreditCard,
  PieChart,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";

export const navigationLinks = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
    activeClass: "bg-blue-50 text-blue-700",
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
    activeClass: "bg-purple-50 text-purple-700",
  },
  {
    path: "/budget",
    label: "Budget",
    icon: CreditCard,
    activeClass: "bg-blue-50 text-blue-700",
  },
  {
    path: "/incomes",
    label: "Incomes",
    icon: DollarSign,
    activeClass: "bg-green-50 text-green-700",
  },
  {
    path: "/accounts",
    label: "Accounts",
    icon: Wallet,
    activeClass: "bg-yellow-50 text-yellow-700",
  },
  {
    path: "/insights",
    label: "Insights",
    icon: PieChart,
    activeClass: "bg-purple-50 text-purple-700",
  },
];
