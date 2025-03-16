module Expenses
  class Destroy < ApplicationService
    attr_reader :expense

    def initialize(expense)
      @expense = expense
    end

    def call
      if expense.destroy
        { success: true, expense: expense }
      else
        { success: false, errors: expense.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
