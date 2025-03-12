class Income < ApplicationRecord
  belongs_to :user

  # Define frequency options
  FREQUENCIES = %w[monthly bi-weekly weekly daily yearly quarterly].freeze

  # Validations
  validates :name, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :frequency, presence: true, inclusion: { in: FREQUENCIES }

  # Calculate monthly amount based on frequency
  def monthly_amount
    case frequency
    when "monthly"
      amount
    when "bi-weekly"
      (amount * 26) / 12
    when "weekly"
      (amount * 52) / 12
    when "daily"
      (amount * 365) / 12
    when "yearly"
      amount / 12
    when "quarterly"
      amount / 3
    else
      amount
    end
  end
end
