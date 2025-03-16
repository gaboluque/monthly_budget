FactoryBot.define do
  factory :expense do
    name { "Test Expense" }
    amount { 100.00 }
    frequency { "monthly" }
    last_expensed_at { Faker::Date.between(from: 1.year.ago, to: Date.today) }
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
