module Accounts
  class Destroy < ApplicationService
    attr_reader :account

    def initialize(account)
      @account = account
    end

    def call
      if account.destroy
        { success: true, account: account }
      else
        { success: false, errors: account.errors.full_messages }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
