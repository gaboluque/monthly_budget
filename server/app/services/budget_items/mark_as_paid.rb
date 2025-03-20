module BudgetItems
  class MarkAsPaid < ApplicationService
    attr_reader :budget_item, :user

    def initialize(budget_item)
      @budget_item = budget_item
      @user = budget_item.user
    end

    def call
      return { success: true, budget_item: budget_item } if budget_item.paid?

      ActiveRecord::Base.transaction do
        transaction = create_transaction(DateTime.current)

        budget_item.update!(last_paid_at: transaction.executed_at)

        { success: true, budget_item: budget_item }
      end
    end

    private

    def create_transaction(date)
      transaction_params = {
        amount: budget_item.amount,
        transaction_type: Transaction.transaction_types[:expense],
        description: "Budget Item: #{budget_item.name}",
        account_id: budget_item.account_id,
        executed_at: date,
        item: budget_item
      }

      transaction_result = Transactions::Create.call(user, transaction_params)
      unless transaction_result[:success]
        raise StandardError, "Failed to create transaction: #{transaction_result[:errors]}"
      end

      transaction_result[:transaction]
    end
  end
end
