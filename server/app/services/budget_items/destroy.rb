module BudgetItems
  class Destroy < ApplicationService
    attr_reader :budget

    def initialize(budget)
      @budget = budget
    end

    def call
      if budget.destroy
        { success: true, budget: budget }
      else
        { success: false, errors: budget.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
