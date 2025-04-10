import { Layout } from "../components/ui/Layout"
import { PageHeader } from "../components/ui/PageHeader"
import { useDashboard } from "../hooks/useDashboard"
import { MonthlyBalanceCard } from "../components/dashboard/MonthlyBalanceCard"
import { Spinner } from "../components/ui/Spinner"
import { useTransactions } from "../hooks/useTransactions"
import { TransactionsList } from "../components/transactions/TransactionsList"
import { useBudgets } from "../hooks/useBudgets";
import { formatCurrency } from "../lib/utils/currency";
import { useBudgetUsage, BudgetUsageItem } from "../hooks/useBudgetUsage";
import { percentageToColor } from "../lib/utils/formatters"
import { Transaction } from "../lib/types/transactions"

const LoadingState = () => (
  <div className="flex justify-center items-center p-12">
    <div className="animate-pulse flex flex-col items-center">
      <Spinner />
    </div>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
    {title}
  </h3>
);

interface BudgetItemProps {
  budgetName: string;
  usage: BudgetUsageItem;
}

const BudgetItem = ({ budgetName, usage }: BudgetItemProps) => {
  const percentage = usage.percentage;

  return (
    <div key={budgetName}>
      <div className="flex justify-between gap-2">
        <div className="w-24 text-sm font-medium">
          {budgetName}
        </div>
        <div className="w-24 text-sm text-right">
          <span className="font-medium">
            {formatCurrency(usage.usage_amount || 0)}
          </span>
          <span className="text-gray-500 text-xs ml-1">
            ({Number(percentage).toFixed(1)}%)
          </span>
        </div>
      </div>
      <div className="flex-1">
        <div className="h-2 rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-${percentageToColor(percentage)}-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const BudgetOverview = ({ budgetsUsage, isLoading }: { budgetsUsage: Record<string, BudgetUsageItem>; isLoading: boolean }) => (
  <section id="budget-overview">
    <SectionTitle title="Budget Overview" />
    <div className="border border-gray-100 shadow-sm bg-white p-4 rounded-lg">
      {isLoading ? (
        <LoadingState />
      ) : Object.entries(budgetsUsage).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Object.entries(budgetsUsage).map(([budgetName, budgetUsage]) => (
            <BudgetItem key={budgetName} budgetName={budgetName} usage={budgetUsage} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No budgets found
        </div>
      )}
    </div>
  </section>
);

const RecentTransactionsSection = ({ transactions, isLoading }: { transactions: Transaction[]; isLoading: boolean }) => (
  <section id="recent-transactions">
    <SectionTitle title="Recent Transactions" />
    <div className="grid grid-cols-1 gap-4">
      <TransactionsList transactions={transactions} isLoading={isLoading} onOpen={() => { }} />
    </div>
  </section>
);

export default function Dashboard() {
  const { monthlyBalance, monthlyBalanceLoading } = useDashboard();
  const { transactions: recentTransactions, isLoading: recentTransactionsLoading } = useTransactions({
    limit: 3,
  });
  const { isLoading: budgetsLoading } = useBudgets();
  const { budgetsUsage, isLoading: budgetUsageLoading } = useBudgetUsage();

  return (
    <Layout>
      <PageHeader title="Pluto" description="Your Monthly Budget Dashboard" />
      {
        budgetsLoading || budgetUsageLoading || monthlyBalanceLoading ? (
          <LoadingState />
        ) : (
          <div className="flex flex-col gap-6">
            <MonthlyBalanceCard
              monthlyBalance={monthlyBalance?.monthly_balance || "0"}
              incomeTotal={monthlyBalance?.incomes?.total || "0"}
              expensesTotal={monthlyBalance?.expenses?.total || "0"}
            />
            <BudgetOverview
              budgetsUsage={budgetsUsage}
              isLoading={budgetsLoading || budgetUsageLoading}
            />
            <RecentTransactionsSection
              transactions={recentTransactions}
              isLoading={recentTransactionsLoading}
            />
          </div>
        )
      }
    </Layout>
  )
}
