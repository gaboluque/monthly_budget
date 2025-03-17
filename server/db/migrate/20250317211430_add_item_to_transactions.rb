class AddItemToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_reference :transactions, :item, polymorphic: true, null: true
  end
end
