module Transactions
  class Filter < ApplicationService
    attr_reader :user, :params

    def initialize(user, params = {})
      @user = user
      @params = params
    end

    def call
      transactions = user.transactions.includes(:account, :recipient_account)

      # Apply filters if provided
      transactions = transactions.by_type(params[:transaction_type]) if params[:transaction_type].present?

      if params[:start_date].present? && params[:end_date].present?
        transactions = transactions.by_date_range(params[:start_date], params[:end_date])
      end

      transactions = transactions.where(account_id: params[:account_id]) if params[:account_id].present?

      # Order by execution date (newest first)
      transactions = transactions.order(executed_at: :desc)

      { success: true, transactions: transactions }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
