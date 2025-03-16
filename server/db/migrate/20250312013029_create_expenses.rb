class CreateExpenses < ActiveRecord::Migration[8.0]
  def change
    create_table :expenses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.decimal :amount, null: false, precision: 10, scale: 2
      t.string :category, null: false
      t.references :account, null: false, foreign_key: true
      t.string :frequency, null: false

      t.timestamps
    end

    add_index :expenses, :category
    add_index :expenses, :frequency
  end
end
