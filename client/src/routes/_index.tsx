import Accounts from "./accounts";
import Budget from "./budget";
import Dashboard from "./dashboard";
import Incomes from "./incomes";
import Transactions from "./transactions";
import Insights from "./insights";
import Login from "./login";
import AccountSection from "./account";
import Onboarding from "./onboarding";

type Route = {
    path: string;
    Element: React.ReactNode;
    children?: Route[];
}

export const routes: Route[] = [
    {
        path: "/account",
        Element: <AccountSection />,
        children: [
            {
                path: "/accounts",
                Element: <Accounts />,
            },
            {
                path: "/incomes",
                Element: <Incomes />,
            },
            {
                path: "/budget",
                Element: <Budget />,
            },
        ],
    },
    {
        path: "/dashboard",
        Element: <Dashboard />,
    },
    {
        path: "/insights",
        Element: <Insights />,
    },
    {
        path: "/login",
        Element: <Login />,
    },
    {
        path: "/transactions",
        Element: <Transactions />,
    },
    {
        path: "/onboarding",
        Element: <Onboarding />,
    },
]