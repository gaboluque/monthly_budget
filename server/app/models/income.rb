# == Schema Information
#
# Table name: incomes
#
#  id               :bigint           not null, primary key
#  amount           :decimal(15, 2)   not null
#  frequency        :string           not null
#  last_received_at :datetime
#  name             :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  account_id       :bigint           not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_incomes_on_account_id  (account_id)
#  index_incomes_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
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

  def current_month_transaction
    transactions.where(executed_at: DateTime.current.beginning_of_month..DateTime.current.end_of_month).last
  end

  def last_executed_at
    transactions.where(transaction_type: Transaction.transaction_types[:income]).last&.executed_at
  end
end
