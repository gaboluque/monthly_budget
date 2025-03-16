class Expense < ApplicationRecord
  belongs_to :user
  belongs_to :account, optional: true

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
end
