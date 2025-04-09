# == Schema Information
#
# Table name: budgets
#
#  id           :bigint           not null, primary key
#  amount       :decimal(15, 2)   not null
#  frequency    :string           default("monthly"), not null
#  last_paid_at :datetime
#  name         :string           not null
#  nature       :string           default("other"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_budgets_on_frequency  (frequency)
#  index_budgets_on_nature     (nature)
#  index_budgets_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Budget < ApplicationRecord
  belongs_to :user

  has_many :budget_categories, dependent: :destroy
  has_many :categories, through: :budget_categories
  
  validates :name, presence: true
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }

  enum :frequency, {
    monthly: 'monthly'
  }, default: :monthly

  enum :nature, {
    need: 'need',
    want: 'want',
    debt: 'debt',
    saving: 'saving',
    investment: 'investment',
    income: 'income',
    other: 'other'
  }, default: :other

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

  def paid?
    paid_this_month?
  end
end
