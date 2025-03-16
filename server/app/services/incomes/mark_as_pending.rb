module Incomes
  class MarkAsPending < ApplicationService
    attr_reader :income, :user

    def initialize(income, user)
      @income = income
      @user = user
    end

    def call
      return { success: false, errors: 'Income is not received' } if user.incomes.received_this_month.where(id: income.id).blank?

      ActiveRecord::Base.transaction do
        if income.update(last_received_at: nil)
          income.account.update!(balance: income.account.balance - income.amount)
          { success: true, income: income }
        else
          { success: false, errors: income.errors.full_messages }
        end
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
