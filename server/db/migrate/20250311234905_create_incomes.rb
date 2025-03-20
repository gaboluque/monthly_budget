class CreateIncomes < ActiveRecord::Migration[8.0]
  def change
    create_table :incomes do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.decimal :amount, precision: 15, scale: 2, null: false
      t.string :frequency, null: false
      t.references :account, null: false, foreign_key: true
      t.timestamps
    end
  end
end
