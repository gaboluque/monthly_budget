module Transactions
  class Destroy < ApplicationService
    attr_reader :transaction

    def initialize(transaction)
      @transaction = transaction
    end

    def call
      ActiveRecord::Base.transaction do
        rollback_transaction

        { success: true, transaction: transaction }
      end
    end

    private

    def rollback_transaction
      item = transaction.item
      type = transaction.transaction_type

      case type
      when Transaction.transaction_types[:income]
        Incomes::MarkAsPending.call(item, transaction)
      when Transaction.transaction_types[:expense]
        Expenses::MarkAsPending.call(item, transaction)
      when Transaction.transaction_types[:transfer]
      when Transaction.transaction_types[:payment]
      when Transaction.transaction_types[:deposit]
        transaction.account.update(balance: transaction.account.balance - transaction.amount)
      when Transaction.transaction_types[:withdrawal]
        transaction.account.update(balance: transaction.account.balance + transaction.amount)
      end
    end
  end
end
