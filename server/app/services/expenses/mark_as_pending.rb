module Expenses
  class MarkAsPending < ApplicationService
    attr_reader :expense, :user

    def initialize(expense)
      @expense = expense
      @user = expense.user
    end

    def call
      return { success: true, expense: expense } if expense.pending?

      ActiveRecord::Base.transaction do
        expense.update!(last_expensed_at: nil)

        new_balance = expense.account.balance - expense.amount
        expense.account.update!(balance: new_balance)

        { success: true, expense: expense }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
