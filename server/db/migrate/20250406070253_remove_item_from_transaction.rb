class RemoveItemFromTransaction < ActiveRecord::Migration[8.0]
  def change
    remove_column :transactions, :item_id
    remove_column :transactions, :item_type
  end
end
