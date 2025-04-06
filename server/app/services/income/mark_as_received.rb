module Income
  class MarkAsReceived < ApplicationService
    attr_reader :income, :user

    def initialize(income)
      @income = income
      @user = income.user
    end

    def call
      return { success: true, income: income } if income.paid?

      ActiveRecord::Base.transaction do
        transaction = create_transaction(income.last_received_at)

        income.update!(last_received_at: transaction.executed_at)

        { success: true, income: income }
      end
    end

    private

    def create_transaction(date)
      transaction_params = {
        amount: income.amount,
        transaction_type: Transaction.transaction_types[:income],
        description: "Income: #{income.name}",
        account_id: income.account_id,
        executed_at: date,
        item: income
      }

      transaction_result = Transactions::Create.call(user, transaction_params)
      unless transaction_result[:success]
        raise StandardError, "Failed to create transaction: #{transaction_result[:errors]}"
      end

      transaction_result[:transaction]
    end
  end
end
