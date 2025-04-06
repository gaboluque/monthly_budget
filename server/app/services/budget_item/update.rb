module BudgetItem
  class Update < ApplicationService
    attr_reader :budget_item, :params

    def initialize(budget_item, params)
      @budget_item = budget_item
      @params = params
    end

    def call
      if budget_item.update(params)
        { success: true, budget_item: budget_item }
      else
        { success: false, errors: budget_item.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
