FactoryBot.define do
  factory :income do
    name { Faker::Commerce.product_name }
    amount { Faker::Number.decimal(l_digits: 3, r_digits: 2) }
    frequency { Income::FREQUENCIES.sample }
    last_received_at { Faker::Date.between(from: 1.year.ago, to: Date.today) }
    association :user
    association :account
  end

  factory :received_income, parent: :income do
    last_received_at { 1.day.ago }
  end

  factory :pending_income, parent: :income do
    last_received_at { nil }
  end
end
