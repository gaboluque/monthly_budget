import { useEffect, useState } from "react"
import type { MetaFunction } from "@remix-run/node"
import { Layout } from "../components/ui/Layout"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { BudgetItemForm } from "../components/budget_items/BudgetItemForm"
import { BudgetSummary } from "../components/budget_items/BudgetSummary"
import { BudgetItemCategory } from "../components/budget_items/BudgetItemCategory"
import { useBudgetItems } from "../hooks/useBudgetItems"
import type { BudgetItem, CreateBudgetItemData } from "../lib/types/budget_items"
import { PlusCircle } from "lucide-react"
import { ui } from "../lib/ui/manager"
import { PageHeader } from "../components/ui/PageHeader"
import { Spinner } from "../components/ui/Spinner"
export const meta: MetaFunction = () => {
  return [{ title: "Budget Items | Monthly Budget" }, { name: "description", content: "Manage your budget" }]
}

export default function BudgetItems() {
  const [selectedBudgetItem, setSelectedBudgetItem] = useState<BudgetItem | CreateBudgetItemData | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const { budgetItems, categories, isLoading, totalBudgetItems, budgetItemsByCategory, createBudgetItem, updateBudgetItem, deleteBudgetItem } = useBudgetItems()

  // Initialize all categories as collapsed when they're loaded
  useEffect(() => {
    if (categories.length > 0) {
      const initialExpandState = categories.reduce(
        (acc, category) => {
          acc[category] = false // Start with all categories collapsed
          return acc
        },
        {} as Record<string, boolean>,
      )
      setExpandedCategories(initialExpandState)
    }
  }, [categories])

  const handleSubmit = async (data: CreateBudgetItemData) => {
    try {
      let budgetItem: BudgetItem | null = null;
      if (data?.id) {
        budgetItem = await updateBudgetItem(data.id, data);
      } else {
        budgetItem = await createBudgetItem(data);
      }

      if (budgetItem) setSelectedBudgetItem(null);
    } catch (error) {
      ui.notify({
        message: "Failed to save budget item",
        type: "error",
      });
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleAddBudgetItem = (category?: string) => {
    setSelectedBudgetItem({
      category: category || undefined,
    })
  }

  const handleDeleteBudgetItem = (id: string) => {
    const budgetItem = budgetItems.find(e => e.id === id)
    if (!budgetItem) return

    ui.confirm({
      title: "Delete Budget Item",
      message: `Are you sure you want to delete "${budgetItem.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmVariant: "danger",
      onConfirm: async () => {
        await deleteBudgetItem(id)
        ui.notify({
          type: "success",
          message: `"${budgetItem.name}" has been deleted successfully`
        })
      }
    })
  }

  return (
    <Layout>
      <PageHeader
        title="Monthly Budget"
        description="A list of all your budget items organized by category."
        buttonText="Add Budget Item"
        buttonColor="blue"
        onAction={() => handleAddBudgetItem()}
      />

      {!isLoading && budgetItems.length > 0 && (
        <BudgetSummary
          totalBudgetItems={totalBudgetItems}
          budgetItemCount={budgetItems.length}
          budgetItemsByCategory={budgetItemsByCategory}
        />
      )}

      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-gray-500">
          <Spinner />
        </div>
      ) : budgetItems.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <PlusCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No budget items yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first budget item</p>
          <Button onClick={() => handleAddBudgetItem()} className="inline-flex items-center justify-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Add Budget Item</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <BudgetItemCategory
              key={category}
              category={category}
              budgetItems={budgetItemsByCategory[category] || []}
              isExpanded={expandedCategories[category]}
              onToggle={toggleCategory}
              onAddBudgetItem={handleAddBudgetItem}
              onEditBudgetItem={setSelectedBudgetItem}
              onDeleteBudgetItem={handleDeleteBudgetItem}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedBudgetItem}
        onClose={() => { setSelectedBudgetItem(null) }}
        title={selectedBudgetItem?.id ? "Edit Budget Item" : "Add Budget Item"}
      >
        <BudgetItemForm
          initialData={selectedBudgetItem}
          onSubmit={handleSubmit}
          onCancel={() => {
            setSelectedBudgetItem(null)
          }}
        />
      </Modal>
    </Layout>
  )
}
