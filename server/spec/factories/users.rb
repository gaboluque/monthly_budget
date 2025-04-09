# == Schema Information
#
# Table name: users
#
#  id                      :bigint           not null, primary key
#  email                   :string           not null
#  onboarding_completed_at :datetime
#  password_digest         :string           not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#
FactoryBot.define do
  factory :user do
    email { Faker::Internet.unique.email }
    password { "password123" }
    password_confirmation { "password123" }
  end
end
