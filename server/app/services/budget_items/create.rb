module BudgetItems
  class Create < ApplicationService
    attr_reader :user, :params

    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      budget = user.budgets.build(params)

      if budget.save
        { success: true, budget: budget }
      else
        { success: false, errors: budget.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
