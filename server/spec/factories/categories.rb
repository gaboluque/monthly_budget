# == Schema Information
#
# Table name: categories
#
#  id         :bigint           not null, primary key
#  color      :string
#  icon       :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  parent_id  :bigint
#  user_id    :bigint
#
# Indexes
#
#  index_categories_on_parent_id  (parent_id)
#  index_categories_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => categories.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :category do
    name { Faker::Commerce.unique.department }
    color { Faker::Color.hex_color }
    icon { "home" }
    
    trait :with_user do
      association :user
    end
    
    trait :with_parent do
      association :parent, factory: :category
    end
    
    factory :main_category do
      user { nil }
      parent { nil }
    end
    
    factory :user_category do
      association :user
      parent { nil }
    end
    
    factory :subcategory do
      association :parent, factory: :category
    end
  end
end 
