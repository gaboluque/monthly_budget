class Income < ApplicationRecord
  belongs_to :user
  belongs_to :account
  has_many :transactions, as: :item, dependent: :nullify

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

  # Check if the income was received in the current month
  def received_this_month?
    return false if last_received_at.nil?

    current_month_start = Time.current.beginning_of_month
    current_month_end = Time.current.end_of_month

    last_received_at.between?(current_month_start, current_month_end)
  end

  def pending?
    !received_this_month?
  end
end
