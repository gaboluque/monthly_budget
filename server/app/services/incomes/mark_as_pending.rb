module Incomes
  class MarkAsPending < ApplicationService
    attr_reader :income, :transaction

    def initialize(income)
      @income = income
      @transaction = income.current_month_transaction
    end

    def call
      return { success: true, income: income } if income.pending?

      Transactions::Destroy.call(transaction)
    end
  end
end
