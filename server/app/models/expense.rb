class Expense < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :category, presence: true
  validates :destination, presence: true
  validates :frequency, presence: true

  # Frequency options
  FREQUENCIES = %w[monthly bi-weekly weekly].freeze

  # Default categories
  DEFAULT_CATEGORIES = %w[Needs Wants Savings Debt Investment].freeze

  validates :frequency, inclusion: { in: FREQUENCIES }

  # Scopes
  scope :by_category, ->(category) { where(category: category) }
  scope :by_frequency, ->(frequency) { where(frequency: frequency) }
  scope :pending, -> {
    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month
    where('last_expensed_at IS NULL OR last_expensed_at NOT BETWEEN ? AND ?', current_month_start, current_month_end)
  }
end
