class AddFrequencyToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_column :transactions, :frequency, :string, default: 'one_time'
    add_index :transactions, :frequency
  end
end
