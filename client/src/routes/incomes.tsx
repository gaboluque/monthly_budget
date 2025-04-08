import { useState } from "react"
import { Layout } from "../components/ui/Layout"
import { Modal } from "../components/ui/Modal"
import { IncomeForm } from "../components/incomes/IncomeForm"
import { IncomeSummary } from "../components/incomes/IncomeSummary"
import { IncomeItem } from "../components/incomes/IncomeItem"
import { useIncomes } from "../hooks/useIncomes"
import type { Income, CreateIncomeData } from "../lib/types/incomes"
import { DollarSign, PlusCircle } from "lucide-react"
import { Button } from "../components/ui/Button"
import { ui } from "../lib/ui/manager"
import { PageHeader } from "../components/ui/PageHeader"
import { Spinner } from "../components/ui/Spinner"

export default function Incomes() {
  const [selectedIncome, setSelectedIncome] = useState<Income | CreateIncomeData | null>(null)
  const { incomes, isLoading, totalIncome, createIncome, updateIncome, deleteIncome, handleMarkAsReceived } = useIncomes()

  const handleSubmit = async (data: CreateIncomeData) => {
    try {
      if (selectedIncome?.id) {
        await updateIncome(selectedIncome.id, data)
      } else {
        await createIncome(data)
      }
      setSelectedIncome(null)
    } catch (error) {
      ui.notify({
        message: "Failed to save income",
        type: "error",
        error: error as Error,
      });
    }
  }

  const handleDeleteIncome = async (id: string) => {
    ui.confirm({
      title: "Delete Income",
      message: "Are you sure you want to delete this income?",
      confirmVariant: "danger",
      onConfirm: async () => {
        await deleteIncome(id)
      }
    })
  }

  const handleAddIncome = () => {
    setSelectedIncome({
      name: "",
      amount: 0,
      frequency: "monthly",
    } as Income)
  }

  return (
    <Layout>
      <PageHeader
        title="Income Sources"
        description="A list of all your income sources."
        buttonText="Add Income"
        buttonColor="green"
        onAction={handleAddIncome}
      />

      {!isLoading && incomes.length > 0 && (
        <IncomeSummary totalIncome={totalIncome} incomeCount={incomes.length} />
      )}

      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-gray-500">
          <Spinner />
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
        <div className="grid gap-4 sm:gap-6">
          {incomes.map((income) => (
            <IncomeItem
              key={income.id}
              income={income}
              onEdit={(income) => {
                setSelectedIncome({ ...income, account_id: income.account?.id } as CreateIncomeData)
              }}
              onDelete={handleDeleteIncome}
              onReceive={handleMarkAsReceived}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedIncome}
        onClose={() => {
          setSelectedIncome(null)
        }}
        title={selectedIncome ? "Edit Income" : "Add Income"}
      >
        <IncomeForm
          initialData={selectedIncome as Income}
          onSubmit={handleSubmit}
          onCancel={() => {
            setSelectedIncome(null)
          }}
        />
      </Modal>
    </Layout>
  )
}

