# == Schema Information
#
# Table name: budgets
#
#  id           :bigint           not null, primary key
#  amount       :decimal(15, 2)   not null
#  frequency    :string           default("monthly"), not null
#  last_paid_at :datetime
#  name         :string           not null
#  nature       :string           default("other"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_budgets_on_frequency  (frequency)
#  index_budgets_on_nature     (nature)
#  index_budgets_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :budget do
    name { "Test Budget Item" }
    amount { 100.00 }
    frequency { "monthly" }
    last_paid_at { nil }
    association :user
  end

  # Add an alias for expense to make the transaction factory work
  factory :expense, parent: :budget

  factory :paid_budget, parent: :budget do
    last_paid_at { DateTime.current }
  end

  factory :pending_budget, parent: :budget do
    last_paid_at { nil }
  end
end
