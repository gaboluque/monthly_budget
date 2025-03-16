module Expenses
  class FetchExpensed < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def call
      current_month_start = Time.current.beginning_of_month
      current_month_end = Time.current.end_of_month

      expensed_expenses = user.expenses.where(
        'last_expensed_at BETWEEN ? AND ?',
        current_month_start,
        current_month_end
      ).order(last_expensed_at: :desc)

      { success: true, expenses: expensed_expenses }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
