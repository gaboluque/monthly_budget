# == Schema Information
#
# Table name: budget_items
#
#  id           :bigint           not null, primary key
#  amount       :decimal(15, 2)   not null
#  category     :string           not null
#  frequency    :string           not null
#  last_paid_at :datetime
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_budget_items_on_category   (category)
#  index_budget_items_on_frequency  (frequency)
#  index_budget_items_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class BudgetItem < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }

  DEFAULT_CATEGORIES = %w[needs wants savings debt investment other].freeze

  enum :category, DEFAULT_CATEGORIES.map { |c| [ c, c ] }.to_h, default: :other, prefix: true

  enum :frequency, {
    monthly: 'monthly'
  }, default: :monthly

  scope :by_category, ->(category) { where(category: category) }
  scope :by_frequency, ->(frequency) { where(frequency: frequency) }
  scope :pending, -> {
    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month
    where('last_paid_at IS NULL OR last_paid_at NOT BETWEEN ? AND ?', current_month_start, current_month_end)
  }

  scope :paid, -> {
    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month
    where('last_paid_at BETWEEN ? AND ?', current_month_start, current_month_end)
  }

  def paid_this_month?
    last_paid_at.present? && last_paid_at.between?(Time.current.beginning_of_month, Time.current.end_of_month)
  end

  def pending?
    !paid_this_month?
  end
end
