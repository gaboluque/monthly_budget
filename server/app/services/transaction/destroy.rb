module Transaction
  class Destroy < ApplicationService
    attr_reader :transaction

    def initialize(transaction)
      @transaction = transaction
    end

    def call
      ActiveRecord::Base.transaction do
        rollback_transaction!
        transaction.destroy!
        mark_items_as_pending!
        update_budget_item!

        { success: true, transaction: transaction }
      end
    end

    private

    def rollback_transaction!
      case transaction.transaction_type
      when Transaction.transaction_types[:transfer]
        transaction.account.update!(balance: transaction.account.balance + transaction.amount)
        transaction.recipient_account.update!(balance: transaction.recipient_account.balance - transaction.amount)
      when Transaction.transaction_types[:income]
        transaction.account.update!(balance: transaction.account.balance - transaction.amount)
      when Transaction.transaction_types[:expense]
        transaction.account.update!(balance: transaction.account.balance + transaction.amount)
      else
        raise "Unsupported transaction type: #{transaction.transaction_type}"
      end
    end

    def mark_items_as_pending!
      item = transaction.item
      return unless item

      case item
      when BudgetItem
        item.update!(last_paid_at: item.reload.last_executed_at)
      when Income
        item.update!(last_received_at: item.reload.last_executed_at)
      end
    end

    def update_budget_item!
      transaction.budget_item.update!(last_paid_at: nil)
    end
  end
end
