import Accounts from "./accounts";
import Budget from "./budget";
import Dashboard from "./dashboard";
import Incomes from "./incomes";
import Transactions from "./transactions";
import Insights from "./insights";
import Login from "./login";
import AccountSection from "./account";

export const routes = [
    {
        path: "/account",
        Element: <AccountSection />,
    },
    {
        path: "/account/accounts",
        Element: <Accounts />,
    },
    {
        path: "/account/incomes",
        Element: <Incomes />,
    },
    {
        path: "/budget", 
        Element: <Budget />,
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
]