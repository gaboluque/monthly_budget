module BudgetItems
  class MarkAsPending < ApplicationService
    attr_reader :budget_item, :user, :transaction

    def initialize(budget_item)
      @budget_item = budget_item
      @user = budget_item.user
      @transaction = budget_item.current_month_transaction
    end

    def call
      return { success: true, budget_item: budget_item } if budget_item.pending?

      ActiveRecord::Base.transaction do
        result = Transactions::Destroy.call(transaction)

        if result[:success]
          budget_item.update!(last_paid_at: budget_item.reload.last_executed_at)
        else
          return { success: false, errors: result[:errors] }
        end

        { success: true, budget_item: budget_item }
      end
    end
  end
end
