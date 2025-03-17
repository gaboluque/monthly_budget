module Transactions
  class Create < ApplicationService
    attr_reader :user, :params

    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      transaction = user.transactions.build(params)

      if transaction.save
        { success: true, transaction: transaction }
      else
        { success: false, errors: transaction.errors.full_messages }
      end
    end
  end
end
