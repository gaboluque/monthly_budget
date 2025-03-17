module Transactions
  class Destroy < ApplicationService
    attr_reader :transaction

    def initialize(transaction)
      @transaction = transaction
    end

    def call
      if transaction.destroy
        { success: true, transaction: transaction }
      else
        { success: false, errors: transaction.errors.full_messages }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
