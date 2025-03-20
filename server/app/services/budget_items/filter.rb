module BudgetItems
  class Filter < ApplicationService
    attr_reader :user, :params

    def initialize(user, params = {})
      @user = user
      @params = params
    end

    def call
      budget_items = user.budget_items

      # Apply filters
      budget_items = budget_items.by_category(params[:category]) if params[:category].present?
      budget_items = budget_items.by_frequency(params[:frequency]) if params[:frequency].present?
      budget_items = budget_items.by_account(params[:account_id]) if params[:account_id].present?

      { success: true, budget_items: budget_items }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
