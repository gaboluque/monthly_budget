module Incomes
  class FetchPending < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def call
      pending_incomes = user.incomes.pending

      { success: true, incomes: pending_incomes }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
