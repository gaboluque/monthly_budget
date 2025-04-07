
# == Schema Information
#
# Table name: transaction_categories
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
#  index_transaction_categories_on_parent_id  (parent_id)
#  index_transaction_categories_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => transaction_categories.id)
#
class Transaction::Category < ApplicationRecord

    belongs_to :user, optional: true
    belongs_to :parent, class_name: 'Transaction::Category', optional: true

    has_many :children, class_name: 'Transaction::Category', foreign_key: :parent_id, dependent: :destroy

    validates :name, presence: true, uniqueness: { scope: :user }

    scope :main, -> { where(user_id: nil) }
    scope :root, -> { where(parent_id: nil) }
end
