module BudgetItems
  class FetchPending < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def call
      pending_budget_items = user.budget_items.pending

      { success: true, budget_items: pending_budget_items }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
