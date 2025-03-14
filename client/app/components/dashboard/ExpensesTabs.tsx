import { useState } from "react"
import { ExpensesList } from "./ExpensesList"
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs"
import type { Expense } from "../../lib/types/expenses"

interface ExpensesTabsProps {
  pendingExpenses: Expense[]
  expensedExpenses: Expense[]
  isLoading: boolean
  markingExpensed: string | null
  sortField: "category" | "amount"
  sortDirection: "asc" | "desc"
  showSortOptions: boolean
  setShowSortOptions: (show: boolean) => void
  handleMarkAsExpensed: (id: string) => Promise<void>
  handleUnmarkAsExpensed: (id: string) => Promise<void>
  handleSortChange: (field: "category" | "amount") => void
  getSortDescription: () => string
}

export function ExpensesTabs({
  pendingExpenses,
  expensedExpenses,
  isLoading,
  markingExpensed,
  sortField,
  sortDirection,
  showSortOptions,
  setShowSortOptions,
  handleMarkAsExpensed,
  handleUnmarkAsExpensed,
  handleSortChange,
  getSortDescription,
}: ExpensesTabsProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "expensed">("pending")

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 lg:p-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pending" | "expensed")}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            {pendingExpenses.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {pendingExpenses.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="expensed" className="flex items-center gap-2">
            Expensed
            {expensedExpenses.length > 0 && (
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {expensedExpenses.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {activeTab === "pending" ? (
          <ExpensesList
            expenses={pendingExpenses}
            isLoading={isLoading}
            markingExpensed={markingExpensed}
            sortField={sortField}
            sortDirection={sortDirection}
            showSortOptions={showSortOptions}
            setShowSortOptions={setShowSortOptions}
            onAction={handleMarkAsExpensed}
            handleSortChange={handleSortChange}
            getSortDescription={getSortDescription}
            isPending={true}
          />
        ) : (
          <ExpensesList
            expenses={expensedExpenses}
            isLoading={isLoading}
            markingExpensed={markingExpensed}
            sortField={sortField}
            sortDirection={sortDirection}
            showSortOptions={showSortOptions}
            setShowSortOptions={setShowSortOptions}
            onAction={handleUnmarkAsExpensed}
            handleSortChange={handleSortChange}
            getSortDescription={getSortDescription}
            isPending={false}
          />
        )}
      </Tabs>
    </div>
  )
} 