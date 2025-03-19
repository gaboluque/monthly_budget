# == Schema Information
#
# Table name: expenses
#
#  id               :bigint           not null, primary key
#  amount           :decimal(15, 2)   not null
#  category         :string           not null
#  frequency        :string           not null
#  last_expensed_at :datetime
#  name             :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  account_id       :bigint           not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_expenses_on_account_id  (account_id)
#  index_expenses_on_category    (category)
#  index_expenses_on_frequency   (frequency)
#  index_expenses_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :expense do
    name { "Test Expense" }
    amount { 100.00 }
    frequency { "monthly" }
    last_expensed_at { DateTime.current }
    category { "Needs" }
    association :user
    association :account
  end

  factory :expensed_expense, parent: :expense do
    last_expensed_at { DateTime.current }
  end

  factory :pending_expense, parent: :expense do
    last_expensed_at { nil }
  end
end
