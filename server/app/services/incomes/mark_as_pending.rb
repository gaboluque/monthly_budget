module Incomes
  class MarkAsPending < ApplicationService
    attr_reader :income, :user, :account, :transaction

    def initialize(income)
      @income = income
      @user = income.user
      @account = income.account
      @transaction = income.current_month_transaction
    end

    def call
      return { success: true, income: income } if income.pending?

      ActiveRecord::Base.transaction do
        Transactions::Destroy.call(transaction)

        income.update!(last_received_at: income.last_executed_at)

        { success: true, income: income }
      end
    end
  end
end
