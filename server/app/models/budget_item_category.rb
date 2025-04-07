# == Schema Information
#
# Table name: budget_item_categories
#
#  id                      :bigint           not null, primary key
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  budget_item_id          :bigint           not null
#  transaction_category_id :bigint           not null
#
# Indexes
#
#  index_budget_item_categories_on_budget_item_id           (budget_item_id)
#  index_budget_item_categories_on_transaction_category_id  (transaction_category_id)
#  unique_budget_item_categories                            (budget_item_id,transaction_category_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (budget_item_id => budget_items.id)
#  fk_rails_...  (transaction_category_id => transaction_categories.id)
#
class BudgetItemCategory < ApplicationRecord
  belongs_to :budget_item
  belongs_to :transaction_category, class_name: 'Transaction::Category'

  validates :budget_item_id, uniqueness: { scope: :transaction_category_id }
end
