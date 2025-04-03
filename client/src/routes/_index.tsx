import Accounts from "./accounts";
import Budget from "./budget";
import Dashboard from "./dashboard";
import Incomes from "./incomes";
import Transactions from "./transactions";
import Insights from "./insights";
import Login from "./login";

export const routes = [
    {
        path: "/accounts",
        Element: <Accounts />,
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
        path: "/incomes",
        Element: <Incomes />,
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