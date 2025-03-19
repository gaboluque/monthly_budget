# == Schema Information
#
# Table name: transactions
#
#  id                   :bigint           not null, primary key
#  amount               :decimal(10, 2)   not null
#  description          :text
#  executed_at          :datetime         not null
#  frequency            :string           default("one_time")
#  item_type            :string
#  transaction_type     :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  account_id           :bigint           not null
#  item_id              :bigint
#  recipient_account_id :bigint
#  user_id              :bigint           not null
#
# Indexes
#
#  index_transactions_on_account_id            (account_id)
#  index_transactions_on_frequency             (frequency)
#  index_transactions_on_item                  (item_type,item_id)
#  index_transactions_on_recipient_account_id  (recipient_account_id)
#  index_transactions_on_transaction_type      (transaction_type)
#  index_transactions_on_user_id               (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (recipient_account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :transaction do
    association :user
    association :account
    amount { Faker::Number.decimal(l_digits: 3, r_digits: 2) }
    transaction_type { Transaction.transaction_types[:deposit] }
    description { Faker::Lorem.sentence }
    executed_at { DateTime.current }

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

    trait :executed_in_current_month do
      executed_at { 1.day.ago }
    end

    trait :executed_in_past_month do
      executed_at { 40.days.ago }
    end
  end
end
