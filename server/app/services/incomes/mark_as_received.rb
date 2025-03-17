module Incomes
  class MarkAsReceived < ApplicationService
    attr_reader :income, :user

    def initialize(income)
      @income = income
      @user = income.user
    end

    def call
      return { success: true, income: income } if income.received_this_month?

      ActiveRecord::Base.transaction do
        income.update!(last_received_at: Time.current)

        new_balance = income.account.balance + income.amount
        income.account.update!(balance: new_balance)

        create_transaction

        { success: true, income: income }
      end
    end

    private

    def create_transaction
      transaction_params = {
        amount: income.amount,
        transaction_type: Transaction.transaction_types[:income],
        description: "Income: #{income.name}",
        account_id: income.account_id,
        executed_at: Time.current,
        item: income
      }

      transaction_result = Transactions::Create.call(user, transaction_params)
      unless transaction_result[:success]
        raise StandardError, "Failed to create transaction: #{transaction_result[:errors]}"
      end

      transaction_result
    end
  end
end
