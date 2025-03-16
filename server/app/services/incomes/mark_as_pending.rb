module Incomes
  class MarkAsPending < ApplicationService
    attr_reader :income, :user

    def initialize(income)
      @income = income
      @user = income.user
    end

    def call
      return { success: true, income: income } if income.pending?

      ActiveRecord::Base.transaction do
        income.update!(last_received_at: nil)

        new_balance = income.account.balance - income.amount
        income.account.update!(balance: new_balance)

        { success: true, income: income }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
