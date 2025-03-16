class Income < ApplicationRecord
  belongs_to :user
  belongs_to :account

  # Define frequency options
  FREQUENCIES = %w[monthly bi-weekly weekly daily yearly quarterly].freeze

  # Validations
  validates :name, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :frequency, presence: true, inclusion: { in: FREQUENCIES }

  scope :pending, -> {
    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month
    where('last_received_at IS NULL OR last_received_at NOT BETWEEN ? AND ?', current_month_start, current_month_end)
  }

  scope :received_this_month, -> {
    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month
    where('last_received_at BETWEEN ? AND ?', current_month_start, current_month_end)
  }

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
