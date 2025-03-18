module Transactions
  class Destroy < ApplicationService
    attr_reader :transaction

    def initialize(transaction)
      @transaction = transaction
    end

    def call
      ActiveRecord::Base.transaction do
        rollback_transaction

        transaction.destroy!

        { success: true, transaction: transaction }
      end
    end

    private

    def rollback_transaction
      case transaction.transaction_type
      when Transaction.transaction_types[:deposit]
        transaction.account.update(balance: transaction.account.balance - transaction.amount)
      when Transaction.transaction_types[:withdrawal]
        transaction.account.update(balance: transaction.account.balance + transaction.amount)
      when Transaction.transaction_types[:transfer]
        transaction.account.update(balance: transaction.account.balance + transaction.amount)
        transaction.recipient_account.update(balance: transaction.recipient_account.balance - transaction.amount)
      when Transaction.transaction_types[:payment]
        transaction.account.update(balance: transaction.account.balance + transaction.amount)
      when Transaction.transaction_types[:income]
        transaction.account.update(balance: transaction.account.balance - transaction.amount)
      when Transaction.transaction_types[:expense]
        transaction.account.update(balance: transaction.account.balance + transaction.amount)
      end
    end
  end
end
