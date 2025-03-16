module Expenses
  class MarkAsExpensed < ApplicationService
    attr_reader :expense, :user

    def initialize(expense, user)
      @expense = expense
      @user = user
    end

    def call
      return { success: false, errors: 'Expense is not pending' } if user.expenses.pending.where(id: expense.id).blank?

      ActiveRecord::Base.transaction do
        if expense.update(last_expensed_at: Time.current)
          # Update account balance if expense is associated with an account
          if expense.account.present?
            expense.account.update!(balance: expense.account.balance + expense.amount)
          end
          { success: true, expense: expense }
        else
          { success: false, errors: expense.errors }
        end
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
