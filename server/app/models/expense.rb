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
end
