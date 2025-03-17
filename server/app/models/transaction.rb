class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :account
  belongs_to :recipient_account, class_name: 'Account', optional: true

  validates :amount, presence: true, numericality: true
  validates :transaction_type, presence: true
  validates :executed_at, presence: true

  TRANSACTION_TYPES = %w[Deposit Withdrawal Transfer Payment Income Expense].freeze
  validates :transaction_type, inclusion: { in: TRANSACTION_TYPES }

  scope :by_type, ->(type) { where(transaction_type: type) }
  scope :deposits, -> { where(transaction_type: 'Deposit') }
  scope :withdrawals, -> { where(transaction_type: 'Withdrawal') }
  scope :transfers, -> { where(transaction_type: 'Transfer') }
  scope :payments, -> { where(transaction_type: 'Payment') }
  scope :incomes, -> { where(transaction_type: 'Income') }
  scope :expenses, -> { where(transaction_type: 'Expense') }
  scope :by_date_range, ->(start_date, end_date) { where(executed_at: start_date..end_date) }

  validate :validate_transfer_recipient

  private

  def validate_transfer_recipient
    if transaction_type == 'Transfer' && recipient_account.nil?
      errors.add(:recipient_account, "must be present for transfer transactions")
    end
  end
end
