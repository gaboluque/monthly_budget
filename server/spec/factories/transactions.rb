FactoryBot.define do
  factory :transaction do
    association :user
    association :account
    amount { Faker::Number.decimal(l_digits: 3, r_digits: 2) }
    transaction_type { Transaction.transaction_types[:deposit] }
    description { Faker::Lorem.sentence }
    executed_at { Faker::Time.between(from: 30.days.ago, to: DateTime.now) }

    trait :deposit do
      transaction_type { Transaction.transaction_types[:deposit] }
    end

    trait :withdrawal do
      transaction_type { Transaction.transaction_types[:withdrawal] }
    end

    trait :transfer do
      transaction_type { Transaction.transaction_types[:transfer] }
      association :recipient_account, factory: :account
    end

    trait :payment do
      transaction_type { Transaction.transaction_types[:payment] }
    end

    trait :income do
      transaction_type { Transaction.transaction_types[:income] }
      association :item, factory: :income
    end

    trait :expense do
      transaction_type { Transaction.transaction_types[:expense] }
      association :item, factory: :expense
    end
  end
end
