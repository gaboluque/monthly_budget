import {
  Home,
  CreditCard,
  PieChart,
  ArrowLeftRight,
  User,
  Wallet,
  DollarSign,
} from "lucide-react";

export const navigationLinks = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
    color: "blue",
    description: "View your financial dashboard to see your total balance and recent transactions.",
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
    color: "green",
    description: "View your recent transactions and manage your account.",
  },
  {
    path: "/insights",
    label: "Insights",
    icon: PieChart,
    color: "purple",
    description: "View your financial insights and trends.",
  },
  {
    path: "/account",
    label: "Account",
    icon: User,
    color: "yellow",
    children: [
      {
        path: "/account/accounts",
        label: "Accounts",
        icon: Wallet,
        color: "purple",
        description: "View your accounts and manage your account.",
      },
      {
        path: "/account/incomes",
        label: "Incomes",
        icon: DollarSign,
        color: "green",
        description: "View your incomes and manage your income.",
      },
      {
        path: "/account/budget",
        label: "Budget",
        icon: CreditCard,
        color: "blue",
        description: "Create and manage your budget to track your spending and savings.",
      },
    ],
  },
];
