# == Schema Information
#
# Table name: accounts
#
#  id           :bigint           not null, primary key
#  account_type :string           not null
#  balance      :decimal(15, 2)   not null
#  currency     :string           default("cop"), not null
#  description  :text
#  is_owned     :boolean          default(TRUE), not null
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_accounts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :account do
    name { "Test Account" }
    balance { 1000.00 }
    account_type { "savings" }
    currency { "usd" }
    is_owned { true }
    association :user

    trait :checking do
      account_type { "checking" }
    end

    trait :savings do
      account_type { "savings" }
    end

    trait :credit_card do
      account_type { "credit_card" }
    end

    trait :investment do
      account_type { "investment" }
    end

    trait :loan do
      account_type { "loan" }
    end

    trait :other do
      account_type { "other" }
    end

    trait :cop do
      currency { "cop" }
    end

    trait :usd do
      currency { "usd" }
    end

    trait :eur do
      currency { "eur" }
    end

    trait :owned do
      is_owned { true }
    end

    trait :not_owned do
      is_owned { false }
    end
  end
end
