module Accounts
  class Filter < ApplicationService
    attr_reader :user, :params

    def initialize(user, params = {})
      @user = user
      @params = params
    end

    def call
      accounts = user.accounts

      # Apply filters if provided
      accounts = accounts.by_type(params[:account_type]) if params[:account_type].present?
      accounts = accounts.by_currency(params[:currency]) if params[:currency].present?
      accounts = accounts.owned if params[:owned].present? && params[:owned] == 'true'
      accounts = accounts.not_owned if params[:owned].present? && params[:owned] == 'false'

      { success: true, accounts: accounts }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
