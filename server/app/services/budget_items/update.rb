module BudgetItems
  class Update < ApplicationService
    attr_reader :budget, :params

    def initialize(budget, params)
      @budget = budget
      @params = params
    end

    def call
      if budget.update(params)
        { success: true, budget: budget }
      else
        { success: false, errors: budget.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
