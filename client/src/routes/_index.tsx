import Accounts from "./accounts";
import Budget from "./budget";
import Dashboard from "./dashboard";
import Incomes from "./incomes";
import Transactions from "./transactions";
import Insights from "./insights";
import Login from "./login";
import AccountSection from "./account";
import Onboarding from "./onboarding";
import { Home, ArrowLeftRight, PieChart, Wallet, Banknote, User } from "lucide-react";


type Route = {
    path: string;
    element: React.ReactNode;
    children?: Route[];
    icon?: React.ElementType;
    label?: string;
    description?: string;
    color?: string;
    nav?: boolean;
}

export const routes: Record<string, Route> = {
    dashboard: {
        path: "/dashboard",
        element: <Dashboard />,
        icon: Home,
        label: "Dashboard",
        description: "View your financial dashboard to see your total balance and recent transactions.",
        color: "blue",
        nav: true,
    },
    transactions: {
        path: "/transactions",
        element: <Transactions />,
        icon: ArrowLeftRight,
        label: "Transactions",
        description: "View your recent transactions and manage your account.",
        color: "green",
        nav: true,
    },
    insights: {
        path: "/insights",
        element: <Insights />,
        icon: PieChart,
        label: "Insights",
        description: "View your financial insights and trends.",
        color: "purple",
        nav: true,
    },
    account: {
        path: "/account",
        element: <AccountSection />,
        icon: Wallet,
        label: "Account",
        description: "Manage your accounts and income sources in one place.",
        color: "orange",
        nav: true,
    },
    accounts: {
        path: "/account/accounts",
        element: <Accounts />,
        icon: Banknote,
        label: "Accounts",
        color: "blue",
        description: "Manage your accounts and income sources in one place.",
    },
    incomes: {
        path: "/account/incomes",
        element: <Incomes />,
        icon: Banknote,
        label: "Incomes",
        color: "green",
        description: "Manage your incomes and expenses.",
    },
    budget: {
        path: "/account/budget",
        element: <Budget />,
        icon: Banknote,
        label: "Budget",
        color: "purple",
        description: "Manage your budget and expenses.",
    },
    login: {
        path: "/login",
        element: <Login />,
        icon: User,
        label: "Login",
        description: "Login to your account.",
        color: "red",
    },
    onboarding: {
        path: "/onboarding",
        element: <Onboarding />,
        icon: User,
        label: "Onboarding",
        description: "Onboarding to your account.",
        color: "blue",
    },
}

export const accountRoutes = [
    routes.accounts,
    routes.incomes,
    routes.budget,
]

export default routes;