module Incomes
  class Filter < ApplicationService
    attr_reader :user, :params

    def initialize(user, params = {})
      @user = user
      @params = params
    end

    def call
      incomes = user.incomes

      # Apply account filter
      incomes = incomes.where(account_id: params[:account_id]) if params[:account_id].present?

      # Apply frequency filter
      incomes = incomes.where(frequency: params[:frequency]) if params[:frequency].present?

      # Apply name filter - use LOWER for better compatibility across databases
      if params[:name].present?
        incomes = incomes.where('LOWER(name) LIKE ?', "%#{params[:name].downcase}%")
      end

      { success: true, incomes: incomes }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
