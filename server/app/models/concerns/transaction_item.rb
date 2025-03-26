module TransactionItem
  extend ActiveSupport::Concern

  included do
    has_many :transactions, as: :item, dependent: :nullify

    scope :current_month, -> {
      joins(:transactions).where(transactions: { executed_at: DateTime.current.beginning_of_month..DateTime.current.end_of_month })
    }
  end

  def transaction_item?
    true
  end

  def current_month_transaction
    transactions.where(executed_at: DateTime.current.beginning_of_month..DateTime.current.end_of_month).order(executed_at: :desc).first
  end

  def last_executed_at
    transactions.where(transaction_type: Transaction.transaction_types[:income]).last&.executed_at
  end

  def pending?
    !current_month_transaction
  end

  def paid?
    !pending?
  end
end
