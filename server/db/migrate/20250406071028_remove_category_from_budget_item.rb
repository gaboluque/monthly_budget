class RemoveCategoryFromBudgetItem < ActiveRecord::Migration[8.0]
  def change
    remove_column :budget_items, :category
  end
end
