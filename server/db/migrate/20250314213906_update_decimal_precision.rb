class UpdateDecimalPrecision < ActiveRecord::Migration[8.0]
  def change
    # Update accounts table
    change_column :accounts, :balance, :decimal, precision: 15, scale: 2, null: false

    # Update expenses table
    change_column :expenses, :amount, :decimal, precision: 15, scale: 2, null: false

    # Update incomes table
    change_column :incomes, :amount, :decimal, precision: 15, scale: 2, null: false
  end
end
