class AddIsOwnedToAccounts < ActiveRecord::Migration[8.0]
  def change
    add_column :accounts, :is_owned, :boolean, null: false, default: true
  end
end
