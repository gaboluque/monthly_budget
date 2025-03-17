module Transactions
  class Formatter < ApplicationService
    attr_reader :transaction

    def initialize(transaction)
      @transaction = transaction
    end

    def call
      json = transaction.as_json(
        only: [ :id, :amount, :transaction_type, :description, :executed_at, :created_at, :updated_at ]
      )

      # Include account
      json[:account] = transaction.account.as_json if transaction.account

      # Include recipient_account if present
      json[:recipient_account] = transaction.recipient_account.as_json if transaction.recipient_account

      { success: true, formatted_transaction: json }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
