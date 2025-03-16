module Expenses
  class Create < ApplicationService
    attr_reader :user, :params

    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      expense = user.expenses.build(params)

      if expense.save
        { success: true, expense: expense }
      else
        { success: false, errors: expense.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
