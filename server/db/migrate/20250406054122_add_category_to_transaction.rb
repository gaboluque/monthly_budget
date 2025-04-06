class AddCategoryToTransaction < ActiveRecord::Migration[8.0]
  def change
    add_reference :transactions, :category, null: false, default: 0, foreign_key: { to_table: :transaction_categories }
  end
end
