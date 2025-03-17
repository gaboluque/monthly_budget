module Transactions
  class FetchTypes < ApplicationService
    def initialize
    end

    def call
      types = fetch_transaction_types
      { success: true, types: types }
    rescue StandardError => e
      { success: false, errors: e.message }
    end

    private

    def fetch_transaction_types
      Transaction.transaction_types.keys
    end
  end
end
