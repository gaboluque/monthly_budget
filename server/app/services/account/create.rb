module Account
  class Create < ApplicationService
    attr_reader :user, :params

    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      account = user.accounts.build(params)

      if account.save
        { success: true, account: account }
      else
        { success: false, errors: account.errors.full_messages }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
