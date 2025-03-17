module Expenses
  class MarkAsExpensed < ApplicationService
    attr_reader :expense, :user

    def initialize(expense)
      @expense = expense
      @user = expense.user
    end

    def call
      return { success: true, expense: expense } if expense.expensed?

      ActiveRecord::Base.transaction do
        expense.update!(last_expensed_at: DateTime.current)

        new_balance = expense.account.balance + expense.amount
        expense.account.update!(balance: new_balance)

        create_transaction(expense.last_expensed_at)

        { success: true, expense: expense }
      end
    end

    private

    def create_transaction(date)
      transaction_params = {
        amount: expense.amount,
        transaction_type: Transaction.transaction_types[:expense],
        description: "Expense: #{expense.name}",
        account_id: expense.account_id,
        executed_at: date,
        item: expense
      }

      transaction_result = Transactions::Create.call(user, transaction_params)
      unless transaction_result[:success]
        raise StandardError, "Failed to create transaction: #{transaction_result[:errors]}"
      end

      transaction_result
    end
  end
end
