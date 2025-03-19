# == Schema Information
#
# Table name: incomes
#
#  id               :bigint           not null, primary key
#  amount           :decimal(15, 2)   not null
#  frequency        :string           not null
#  last_received_at :datetime
#  name             :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  account_id       :bigint           not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_incomes_on_account_id  (account_id)
#  index_incomes_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :income do
    name { Faker::Commerce.product_name }
    amount { Faker::Number.decimal(l_digits: 3, r_digits: 2) }
    frequency { Income::FREQUENCIES.sample }
    last_received_at { DateTime.current }
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
