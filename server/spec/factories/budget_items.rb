# == Schema Information
#
# Table name: budget_items
#
#  id           :bigint           not null, primary key
#  amount       :decimal(15, 2)   not null
#  category     :string           not null
#  frequency    :string           not null
#  last_paid_at :datetime
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_budget_items_on_category   (category)
#  index_budget_items_on_frequency  (frequency)
#  index_budget_items_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :budget_item do
    name { "Test Budget Item" }
    amount { 100.00 }
    frequency { "monthly" }
    last_paid_at { nil }
    category { "needs" }
    association :user
  end

  # Add an alias for expense to make the transaction factory work
  factory :expense, parent: :budget_item

  factory :paid_budget_item, parent: :budget_item do
    last_paid_at { DateTime.current }
  end

  factory :pending_budget_item, parent: :budget_item do
    last_paid_at { nil }
  end
end
