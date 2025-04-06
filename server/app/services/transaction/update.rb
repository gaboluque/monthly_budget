module Transaction
  class Update < ApplicationService
    attr_reader :transaction, :params

    def initialize(transaction, params)
      @transaction = transaction
      @params = params
    end

    def call
      transaction.update!(params)

      { success: true, transaction: transaction }
    end
  end
end
