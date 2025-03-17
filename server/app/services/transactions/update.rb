module Transactions
  class Update < ApplicationService
    attr_reader :transaction, :params

    def initialize(transaction, params)
      @transaction = transaction
      @params = params
    end

    def call
      if transaction.update(params)
        { success: true, transaction: transaction }
      else
        { success: false, errors: transaction.errors.full_messages }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
