class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :account
  belongs_to :recipient_account, class_name: 'Account', optional: true
  belongs_to :item, polymorphic: true, optional: true

  validates :amount, presence: true, numericality: true
  validates :transaction_type, presence: true
  validates :executed_at, presence: true

  enum :transaction_type, {
    deposit: 'deposit',
    withdrawal: 'withdrawal',
    transfer: 'transfer',
    payment: 'payment',
    income: 'income',
    expense: 'expense'
  }

  scope :by_type, ->(type) { where(transaction_type: type) }
  scope :deposits, -> { where(transaction_type: :deposit) }
  scope :withdrawals, -> { where(transaction_type: :withdrawal) }
  scope :transfers, -> { where(transaction_type: :transfer) }
  scope :payments, -> { where(transaction_type: :payment) }
  scope :incomes, -> { where(transaction_type: :income) }
  scope :expenses, -> { where(transaction_type: :expense) }
  scope :by_date_range, ->(start_date, end_date) { where(executed_at: start_date..end_date) }

  validate :validate_transfer_recipient
  validate :validate_item_association

  # Helper methods for item associations
  def income
    item if income? && item.is_a?(Income)
  end

  def expense
    item if expense? && item.is_a?(Expense)
  end

  def item_name
    item&.name
  end

  private

  def validate_transfer_recipient
    if transfer? && recipient_account.nil?
      errors.add(:recipient_account, "must be present for transfer transactions")
    end
  end

  def validate_item_association
    case transaction_type
    when 'income'
      if item.nil?
        errors.add(:item, "must be associated with an income")
      elsif !item.is_a?(Income)
        errors.add(:item, "must be an Income for income transactions")
      end
    when 'expense'
      if item.nil?
        errors.add(:item, "must be associated with an expense")
      elsif !item.is_a?(Expense)
        errors.add(:item, "must be an Expense for expense transactions")
      end
    end
  end
end
