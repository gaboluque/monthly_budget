class RemoveBudgetItemFromTransaction < ActiveRecord::Migration[8.0]
  def change
    remove_column :transactions, :budget_item_id
  end
end
