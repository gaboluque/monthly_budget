# == Schema Information
#
# Table name: expenses
#
#  id               :bigint           not null, primary key
#  amount           :decimal(15, 2)   not null
#  category         :string           not null
#  frequency        :string           not null
#  last_expensed_at :datetime
#  name             :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  account_id       :bigint           not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_expenses_on_account_id  (account_id)
#  index_expenses_on_category    (category)
#  index_expenses_on_frequency   (frequency)
#  index_expenses_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
class Expense < ApplicationRecord
  belongs_to :user
  belongs_to :account, optional: true
  has_many :transactions, as: :item, dependent: :nullify

  validates :name, presence: true
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :category, presence: true
  validates :frequency, presence: true

  # Frequency options
  FREQUENCIES = %w[monthly bi-weekly weekly].freeze

  # Default categories
  DEFAULT_CATEGORIES = %w[Needs Wants Savings Debt Investment].freeze

  validates :frequency, inclusion: { in: FREQUENCIES }

  # Scopes
  scope :by_category, ->(category) { where(category: category) }
  scope :by_frequency, ->(frequency) { where(frequency: frequency) }
  scope :by_account, ->(account_id) { where(account_id: account_id) }
  scope :pending, -> {
    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month
    where('last_expensed_at IS NULL OR last_expensed_at NOT BETWEEN ? AND ?', current_month_start, current_month_end)
  }

  scope :expensed, -> {
    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month
    where('last_expensed_at BETWEEN ? AND ?', current_month_start, current_month_end)
  }

  def expensed?
    return false if last_expensed_at.nil?

    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month

    last_expensed_at.between?(current_month_start, current_month_end)
  end

  def pending?
    !expensed?
  end

  def current_month_transaction
    transactions.where(executed_at: Time.current.beginning_of_month..Time.current.end_of_month).last
  end

  def last_executed_at
    transactions.where(transaction_type: Transaction.transaction_types[:expense]).last&.executed_at
  end
end
