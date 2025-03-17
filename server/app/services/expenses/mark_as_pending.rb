module Expenses
  class MarkAsPending < ApplicationService
    attr_reader :expense, :user

    def initialize(expense)
      @expense = expense
      @user = expense.user
    end

    def call
      return { success: true, expense: expense } if expense.pending?

      ActiveRecord::Base.transaction do
        new_balance = expense.account.balance - expense.amount
        second_last_transaction_date = expense_transactions.second_to_last&.created_at

        expense.account.update!(balance: new_balance)
        expense.update!(last_expensed_at: second_last_transaction_date)

        remove_transaction

        { success: true, expense: expense }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end

    private

    def remove_transaction
      transaction = expense_transactions.last
      transaction.destroy if transaction.present?
    end

    def expense_transactions
      @expense_transactions ||= user.transactions.where(
        account_id: expense.account_id,
        amount: expense.amount,
        transaction_type: Transaction.transaction_types[:expense]
      ).order(created_at: :desc)
    end
  end
end
