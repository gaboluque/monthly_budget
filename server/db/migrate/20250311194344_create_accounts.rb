class CreateAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.decimal :balance, precision: 10, scale: 2, null: false
      t.string :account_type, null: false
      t.string :currency, null: false, default: 'COP'
      t.text :description

      t.timestamps
    end
  end
end
