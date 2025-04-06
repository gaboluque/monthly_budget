module BudgetItem
  class Destroy < ApplicationService
    attr_reader :budget_item

    def initialize(budget_item)
      @budget_item = budget_item
    end

    def call
      if budget_item.destroy
        { success: true, budget_item: budget_item }
      else
        { success: false, errors: budget_item.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
