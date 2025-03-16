module Expenses
  class Filter < ApplicationService
    attr_reader :user, :params

    def initialize(user, params = {})
      @user = user
      @params = params
    end

    def call
      expenses = user.expenses

      # Apply filters
      expenses = expenses.by_category(params[:category]) if params[:category].present?
      expenses = expenses.by_frequency(params[:frequency]) if params[:frequency].present?
      expenses = expenses.by_account(params[:account_id]) if params[:account_id].present?

      { success: true, expenses: expenses }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
