class AddCategoryToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_column :transactions, :category, :string
    add_index :transactions, :category
  end
end
