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
class Category < ApplicationRecord
    belongs_to :user, optional: true
    belongs_to :parent, class_name: 'Category', optional: true

    has_many :children, class_name: 'Category', foreign_key: :parent_id, dependent: :destroy, inverse_of: :parent

    has_many :budget_categories, dependent: :destroy
    has_many :budgets, through: :budget_categories

    validates :name, presence: true, uniqueness: { scope: :user }

    scope :main, -> { where(user_id: nil) }
    scope :root, -> { where(parent_id: nil) }
end
