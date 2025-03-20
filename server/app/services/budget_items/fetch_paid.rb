module BudgetItems
  class FetchPaid < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def call
      current_month_start = Time.current.beginning_of_month
      current_month_end = Time.current.end_of_month

      paid_budget_items = user.budget_items.where(
        'last_paid_at BETWEEN ? AND ?',
        current_month_start,
        current_month_end
      ).order(last_paid_at: :desc)

      { success: true, budget_items: paid_budget_items }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
