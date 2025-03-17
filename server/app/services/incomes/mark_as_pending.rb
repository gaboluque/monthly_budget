module Incomes
  class MarkAsPending < ApplicationService
    attr_reader :income, :user, :account, :transaction

    def initialize(income, transaction = nil)
      @income = income
      @user = income.user
      @account = income.account
      @transaction = transaction
    end

    def call
      return { success: true, income: income } if income.pending?

      ActiveRecord::Base.transaction do
        new_balance = account.balance - income.amount
        second_last_transaction_date = income_transactions.second_to_last&.created_at

        account.update!(balance: new_balance)
        income.update!(last_received_at: second_last_transaction_date)

        remove_transaction

        { success: true, income: income }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end

    private

    def remove_transaction
      transaction = transaction || income_transactions.last

      transaction.destroy if transaction.present?
    end

    def income_transactions
      @income_transactions ||= user.transactions.where(
        account_id: account.id,
        amount: income.amount,
        transaction_type: Transaction.transaction_types[:income]
      ).order(created_at: :desc)
    end
  end
end
