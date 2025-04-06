module Account
  class Update < ApplicationService
    attr_reader :account, :params

    def initialize(account, params)
      @account = account
      @params = params
    end

    def call
      if account.update(params)
        { success: true, account: account }
      else
        { success: false, errors: account.errors.full_messages }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
