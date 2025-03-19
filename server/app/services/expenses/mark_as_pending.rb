module Expenses
  class MarkAsPending < ApplicationService
    attr_reader :expense, :user, :transaction

    def initialize(expense)
      @expense = expense
      @user = expense.user
      @transaction = expense.current_month_transaction
    end

    def call
      return { success: true, expense: expense } if expense.pending?

      ActiveRecord::Base.transaction do
        result = Transactions::Destroy.call(transaction)

        if result[:success]
          expense.update!(last_expensed_at: expense.reload.last_executed_at)
        else
          return { success: false, errors: result[:errors] }
        end

        { success: true, expense: expense }
      end
    end
  end
end
