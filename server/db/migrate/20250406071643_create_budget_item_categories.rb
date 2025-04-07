class CreateBudgetItemCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :budget_item_categories do |t|
      t.references :budget_item, null: false, foreign_key: true
      t.references :transaction_category, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :budget_item_categories, [:budget_item_id, :transaction_category_id], unique: true, name: 'unique_budget_item_categories'
  end
end
