class CreateBudgetItems < ActiveRecord::Migration[8.0]
  def change
    create_table :budget_items do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.decimal :amount, null: false, precision: 15, scale: 2
      t.string :category, null: false
      t.references :account, null: false, foreign_key: true
      t.string :frequency, null: false
      t.datetime :last_paid_at

      t.timestamps
    end

    add_index :budget_items, :category
    add_index :budget_items, :frequency
  end
end
