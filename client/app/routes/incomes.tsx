"use client"

import { useEffect, useState, useMemo } from "react"
import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/Layout"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"
import { IncomeForm } from "../components/IncomeForm"
import { incomesApi, type Income, type CreateIncomeData } from "../lib/api/incomes"
import { formatCurrency } from "../utils/currency"
import { PlusCircle, Edit2, Trash2, AlertCircle, Loader2, DollarSign, BarChart2, TrendingUp } from "lucide-react"

export const meta: MetaFunction = () => {
  return [{ title: "Incomes | Monthly Budget" }, { name: "description", content: "Manage your income sources" }]
}

export default function Incomes() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [incomes, setIncomes] = useState<Income[]>([])

  useEffect(() => {
    fetchIncomes()
  }, [])

  const totalIncome = useMemo(() => {
    if (incomes.length === 0) return 0
    return incomes.reduce((acc, income) => acc + Number(income.amount), 0)
  }, [incomes])

  const fetchIncomes = async () => {
    try {
      const data = await incomesApi.getAll()
      setIncomes(data)
    } catch (error) {
      setError("Failed to fetch incomes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: CreateIncomeData) => {
    try {
      if (selectedIncome) {
        await incomesApi.update(selectedIncome.id, data)
      } else {
        await incomesApi.create(data)
      }
      await fetchIncomes()
      setIsModalOpen(false)
      setSelectedIncome(null)
    } catch (error) {
      setError("Failed to save income")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await incomesApi.delete(id)
      await fetchIncomes()
    } catch (error) {
      setError("Failed to delete income")
    }
  }

  // Group incomes by frequency
  const incomesByFrequency = useMemo(() => {
    return incomes.reduce(
      (acc, income) => {
        const frequency = income.frequency || "other"
        if (!acc[frequency]) {
          acc[frequency] = []
        }
        acc[frequency].push(income)
        return acc
      },
      {} as Record<string, Income[]>,
    )
  }, [incomes])

  // Calculate frequency totals
  const frequencyTotals = useMemo(() => {
    const frequencies = Object.keys(incomesByFrequency)
    return frequencies
      .map((frequency) => {
        const frequencyIncomes = incomesByFrequency[frequency]
        const total = frequencyIncomes.reduce((sum, income) => sum + Number(income.amount), 0)
        return {
          frequency,
          total,
          count: frequencyIncomes.length,
          percentage: totalIncome > 0 ? Math.round((total / totalIncome) * 100) : 0,
        }
      })
      .sort((a, b) => b.total - a.total)
  }, [incomesByFrequency, totalIncome])

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
        {/* Header with add button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b pb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-bold text-gray-900">Income Sources</h2>
            <p className="mt-1 text-sm text-gray-600">
              A list of all your income sources including their name, amount, and frequency.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              onClick={() => {
                setSelectedIncome(null)
                setIsModalOpen(true)
              }}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Income</span>
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {!isLoading && incomes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Income Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-green-700">Total Income</h4>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-900 mt-2">{formatCurrency(totalIncome)}</p>
                <p className="text-xs text-green-600 mt-1">{incomes.length} income sources</p>
              </div>

              {/* Top income sources or frequency breakdowns */}
              {frequencyTotals.slice(0, 2).map((freq) => (
                <div key={freq.frequency} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700 capitalize">{freq.frequency}</h4>
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {freq.percentage}%
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 mt-2">{formatCurrency(freq.total)}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {freq.count} source{freq.count !== 1 ? "s" : ""}
                  </p>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${freq.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              onClick={() => {
                setSelectedIncome(null)
                setIsModalOpen(true)
              }}
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
              <div
                key={income.id}
                className="bg-gray-50 border border-gray-100 rounded-lg p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 truncate">{income.name}</h3>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-6 pl-12">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(income.amount)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-1">Frequency:</span>
                        <span className="text-sm text-gray-700 capitalize">{income.frequency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedIncome(income)
                        setIsModalOpen(true)
                      }}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      aria-label="Edit income"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(income.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      aria-label="Delete income"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
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

