import { useState } from "react"
import { Layout } from "../components/ui/Layout"
import { Modal } from "../components/ui/Modal"
import { BudgetItemForm } from "../components/budget_items/BudgetItemForm"
import { useBudgetItems } from "../hooks/useBudgetItems"
import type { BudgetItem, CreateBudgetItemData } from "../lib/types/budget_items"
import { ui } from "../lib/ui/manager"
import { PageHeader } from "../components/ui/PageHeader"
import { formatCurrency } from "../lib/utils/currency"
import { Spinner } from "../components/ui/Spinner"

export default function BudgetItems() {
  const [selectedBudgetItem, setSelectedBudgetItem] = useState<BudgetItem | CreateBudgetItemData | null>(null)
  const { budgetItems, createBudgetItem, updateBudgetItem, deleteBudgetItem, isLoading: isBudgetItemsLoading } = useBudgetItems()


  const handleAddBudgetItem = (category?: string) => {
    setSelectedBudgetItem({
      transaction_category_ids: category ? [Number(category)] : [],
    })
  }

  const handleSubmit = async (data: CreateBudgetItemData) => {
    try {
      let budgetItem: BudgetItem | null = null;
      if (data?.id || selectedBudgetItem?.id) {
        const id = data?.id || selectedBudgetItem?.id;
        if (!id) throw new Error("BudgetItem ID is required");
        
        budgetItem = await updateBudgetItem(id, data);
      } else {
        budgetItem = await createBudgetItem(data);
      }

      if (budgetItem) setSelectedBudgetItem(null);
    } catch (error) {
      ui.notify({
        message: "Failed to save budget item",
        type: "error",
        error: error as Error,
      });
    }
  }

  const handleDeleteBudgetItem = (id: string) => {
    console.log("id", id)
    const budgetItem = budgetItems.find(e => e.id === id)
    console.log("budgetItem", budgetItem)
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
        description="A list of all your budgets."
        buttonText="Add Budget"
        buttonColor="blue"
        onAction={() => handleAddBudgetItem()}
      />

      <div className="mt-6 bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {isBudgetItemsLoading ? (
          <div className="p-6 text-center text-gray-500">
            <Spinner />
          </div>
        ) : budgetItems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No budget items found. Get started by adding your first budget item.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetItems.map((item) => (
              <li key={item.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <div className="flex items-center mt-1">
                      {item.transaction_categories?.map((category) => (
                        <p 
                          key={category.id} 
                          className="block inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2" 
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {category.icon}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </span>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="mr-2 text-blue-600 hover:text-blue-900"
                        onClick={() => setSelectedBudgetItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteBudgetItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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
