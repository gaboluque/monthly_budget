# == Schema Information
#
# Table name: transactions
#
#  id                   :bigint           not null, primary key
#  amount               :decimal(10, 2)   not null
#  description          :text
#  executed_at          :datetime         not null
#  frequency            :string           default("one_time"), not null
#  transaction_type     :string           default("expense"), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  account_id           :bigint           not null
#  category_id          :bigint           default(0), not null
#  recipient_account_id :bigint
#  user_id              :bigint           not null
#
# Indexes
#
#  index_transactions_on_account_id            (account_id)
#  index_transactions_on_category_id           (category_id)
#  index_transactions_on_frequency             (frequency)
#  index_transactions_on_recipient_account_id  (recipient_account_id)
#  index_transactions_on_transaction_type      (transaction_type)
#  index_transactions_on_user_id               (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (recipient_account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :transaction do
    association :user
    association :account
    amount { Faker::Number.decimal(l_digits: 3, r_digits: 2) }
    transaction_type { Transaction.transaction_types[:expense] }
    description { Faker::Lorem.sentence }
    executed_at { DateTime.current }

    trait :transfer do
      transaction_type { Transaction.transaction_types[:transfer] }
      association :recipient_account, factory: :account
    end

    trait :income do
      transaction_type { Transaction.transaction_types[:income] }
    end

    trait :expense do
      transaction_type { Transaction.transaction_types[:expense] }
    end

    trait :executed_in_current_month do
      executed_at { 1.day.ago }
    end

    trait :executed_in_past_month do
      executed_at { 40.days.ago }
    end
  end
end
