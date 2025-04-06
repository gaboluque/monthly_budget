class CreateTransactionCategory < ActiveRecord::Migration[8.0]
  def change
    create_table :transaction_categories do |t|
      t.string :name
      t.string :color
      t.references :user, null: true, foreign_key: true
      t.references :parent, null: true, foreign_key: { to_table: :transaction_categories }
      t.string :icon
      t.timestamps
    end
  end
end
