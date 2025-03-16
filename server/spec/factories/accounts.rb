FactoryBot.define do
  factory :account do
    name { "Test Account" }
    balance { 1000.00 }
    account_type { "Savings" }
    currency { "USD" }
    is_owned { true }
    association :user
  end
end
