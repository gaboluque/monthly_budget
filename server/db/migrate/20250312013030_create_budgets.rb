class CreateBudgets < ActiveRecord::Migration[8.0]
  def change
    create_table :budgets do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.decimal :amount, null: false, precision: 15, scale: 2
      t.string :frequency, null: false, default: "monthly"
      t.string :nature, null: false, default: "other"
      t.datetime :last_paid_at

      t.timestamps
    end

    add_index :budgets, :frequency
    add_index :budgets, :nature
  end
end
