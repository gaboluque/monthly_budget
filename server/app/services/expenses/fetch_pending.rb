module Expenses
  class FetchPending < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def call
      pending_expenses = user.expenses.pending

      { success: true, expenses: pending_expenses }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
