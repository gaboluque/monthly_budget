FactoryBot.define do
  factory :transaction do
    association :user
    association :account
    amount { Faker::Number.decimal(l_digits: 3, r_digits: 2) }
    transaction_type { 'Deposit' }
    description { Faker::Lorem.sentence }
    executed_at { Faker::Time.between(from: 30.days.ago, to: DateTime.now) }

    trait :deposit do
      transaction_type { 'Deposit' }
    end

    trait :withdrawal do
      transaction_type { 'Withdrawal' }
    end

    trait :transfer do
      transaction_type { 'Transfer' }
      association :recipient_account, factory: :account
    end

    trait :payment do
      transaction_type { 'Payment' }
    end

    trait :income do
      transaction_type { 'Income' }
    end

    trait :expense do
      transaction_type { 'Expense' }
    end
  end
end
