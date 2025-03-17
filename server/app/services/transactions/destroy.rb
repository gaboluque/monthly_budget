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
      item = transaction.item
      type = transaction.transaction_type

      case type
      when Transaction.transaction_types[:income]
        Incomes::MarkAsPending.call(item, transaction)
      when Transaction.transaction_types[:expense]
        Expenses::MarkAsPending.call(item, transaction)
      end
    end
  end
end
