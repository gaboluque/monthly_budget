module Transactions
  class FetchTypes < ApplicationService
    def call
      { success: true, types: fetch_transaction_types }
    end

    private

    def fetch_transaction_types
      Transaction.transaction_types.keys
    end
  end
end
