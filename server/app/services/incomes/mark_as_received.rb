module Incomes
  class MarkAsReceived < ApplicationService
    attr_reader :income, :user

    def initialize(income)
      @income = income
      @user = income.user
    end

    def call
      return { success: true, income: income } if income.paid?

      ActiveRecord::Base.transaction do
        income.update!(last_received_at: Time.current)

        { success: true, income: income }
      end
    end
  end
end
