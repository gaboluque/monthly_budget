class RemoveCategoryFromTransaction < ActiveRecord::Migration[8.0]
  def change
    remove_column :transactions, :category
  end
end
