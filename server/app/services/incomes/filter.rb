module Incomes
  class Filter < ApplicationService
    attr_reader :user, :params

    def initialize(user, params = {})
      @user = user
      @params = params
    end

    def call
      incomes = user.incomes

      # Add filters here if needed in the future
      # For example, filter by date range, category, etc.

      { success: true, incomes: incomes }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
