module Incomes
  class Create < ApplicationService
    attr_reader :user, :params

    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      income = user.incomes.build(params)

      if income.save
        { success: true, income: income }
      else
        { success: false, errors: income.errors.full_messages }
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
