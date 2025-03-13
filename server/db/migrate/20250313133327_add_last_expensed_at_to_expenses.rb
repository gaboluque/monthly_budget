class AddLastExpensedAtToExpenses < ActiveRecord::Migration[8.0]
  def change
    add_column :expenses, :last_expensed_at, :datetime, null: true
  end
end
