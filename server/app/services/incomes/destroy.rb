module Incomes
  class Destroy < ApplicationService
    attr_reader :income

    def initialize(income)
      @income = income
    end

    def call
      if income.destroy
        { success: true, income: income }
      else
        { success: false, errors: income.errors.full_messages }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
