module Incomes
  class Update < ApplicationService
    attr_reader :income, :params

    def initialize(income, params)
      @income = income
      @params = params
    end

    def call
      if income.update(params)
        { success: true, income: income }
      else
        { success: false, errors: income.errors.full_messages }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
