class CreateCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :categories do |t|
      t.string :name
      t.string :color
      t.references :user, null: true, foreign_key: true
      t.references :parent, null: true, foreign_key: { to_table: :categories }
      t.string :icon
      t.timestamps
    end
  end
end
