module Transactions
  class Create < ApplicationService
    attr_reader :user, :params

    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      ActiveRecord::Base.transaction do
        transaction = user.transactions.build(params)
        transaction.executed_at = Time.current if transaction.executed_at.blank?

        apply_transaction(transaction)

        if transaction.save
          { success: true, transaction: transaction }
        else
          { success: false, errors: transaction.errors.full_messages }
        end
      end
    end

    private

    def apply_transaction(transaction)
      case transaction.transaction_type
      when Transaction.transaction_types[:deposit]
        transaction.account.update(balance: transaction.account.balance + transaction.amount)
      when Transaction.transaction_types[:withdrawal]
        transaction.account.update(balance: transaction.account.balance - transaction.amount)
      when Transaction.transaction_types[:transfer]
        transaction.account.update(balance: transaction.account.balance - transaction.amount)
        transaction.recipient_account.update(balance: transaction.recipient_account.balance + transaction.amount)
      when Transaction.transaction_types[:payment]
        transaction.account.update(balance: transaction.account.balance - transaction.amount)
      when Transaction.transaction_types[:income]
        transaction.account.update(balance: transaction.account.balance + transaction.amount)
      when Transaction.transaction_types[:expense]
        transaction.account.update(balance: transaction.account.balance - transaction.amount)
      end
    end
  end
end
