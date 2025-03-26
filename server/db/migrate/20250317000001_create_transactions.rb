class CreateTransactions < ActiveRecord::Migration[7.0]
  def change
    create_table :transactions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :account, null: false, foreign_key: true
      t.references :recipient_account, null: true, foreign_key: { to_table: :accounts }
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.string :transaction_type, null: false
      t.text :description
      t.datetime :executed_at, null: false, default: -> { 'CURRENT_TIMESTAMP' }
      t.references :item, polymorphic: true, null: true
      t.references :budget, null: true, foreign_key: true
      t.string :frequency, null: false, default: 'one_time'

      t.timestamps
    end

    add_index :transactions, :transaction_type
    add_index :transactions, :frequency
    add_index :transactions, :budget_id
  end
end
