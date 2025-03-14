import { useState } from "react"
import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/Layout"
import { Modal } from "../components/Modal"
import { IncomeForm } from "../components/incomes/IncomeForm"
import { IncomeHeader } from "../components/incomes/IncomeHeader"
import { IncomeSummary } from "../components/incomes/IncomeSummary"
import { IncomeItem } from "../components/incomes/IncomeItem"
import { useIncomes } from "../hooks/useIncomes"
import type { Income, CreateIncomeData } from "../lib/types/incomes"
import { Loader2, DollarSign, PlusCircle } from "lucide-react"
import { Button } from "../components/Button"
import { ui } from "../lib/ui/manager"
export const meta: MetaFunction = () => {
  return [{ title: "Incomes | Monthly Budget" }, { name: "description", content: "Manage your income sources" }]
}

export default function Incomes() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null)
  const { incomes, isLoading, totalIncome, createIncome, updateIncome, deleteIncome } = useIncomes()

  const handleSubmit = async (data: CreateIncomeData) => {
    try {
      if (selectedIncome?.id) {
        await updateIncome(selectedIncome.id, data)
      } else {
        await createIncome(data)
      }
      setIsModalOpen(false)
      setSelectedIncome(null)
    } catch (error) {
      ui.notify({
        message: "Failed to save income",
        type: "error",
      });
    }
  }

  const handleAddIncome = () => {
    setSelectedIncome(null)
    setIsModalOpen(true)
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
        <IncomeHeader onAddIncome={handleAddIncome} />

        {/* Summary Cards */}
        {!isLoading && incomes.length > 0 && (
          <IncomeSummary totalIncome={totalIncome} incomeCount={incomes.length} />
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="py-12 flex justify-center items-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading income sources...</span>
          </div>
        ) : incomes.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No income sources yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first income source</p>
            <Button
              onClick={handleAddIncome}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Income</span>
            </Button>
          </div>
        ) : (
          /* Income list */
          <div className="grid gap-4 sm:gap-6">
            {incomes.map((income) => (
              <IncomeItem
                key={income.id}
                income={income}
                onEdit={(income) => {
                  setSelectedIncome(income)
                  setIsModalOpen(true)
                }}
                onDelete={deleteIncome}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedIncome(null)
        }}
        title={selectedIncome ? "Edit Income" : "Add Income"}
      >
        <IncomeForm
          initialData={selectedIncome ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedIncome(null)
          }}
        />
      </Modal>
    </Layout>
  )
}

