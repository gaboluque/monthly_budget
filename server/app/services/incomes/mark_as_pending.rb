module Incomes
  class MarkAsPending < ApplicationService
    attr_reader :income

    def initialize(income)
      @income = income
    end

    def call
      return { success: true, income: income } if income.pending?

      income.update!(last_received_at: nil)

      { success: true, income: income }
    end
  end
end
