module Expenses
  class UpdateService < ApplicationService
    attr_reader :expense, :params

    def initialize(expense, params)
      @expense = expense
      @params = params
    end

    def call
      if expense.update(params)
        { success: true, expense: expense }
      else
        { success: false, errors: expense.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
