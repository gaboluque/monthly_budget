class AddLastReceivedAtToIncome < ActiveRecord::Migration[8.0]
  def change
    add_column :incomes, :last_received_at, :datetime
  end
end
