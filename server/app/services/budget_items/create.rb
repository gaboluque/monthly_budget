module BudgetItems
  class Create < ApplicationService
    attr_reader :user, :params

    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      budget_item = user.budget_items.build(params)

      if budget_item.save
        { success: true, budget_item: budget_item }
      else
        { success: false, errors: budget_item.errors }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
