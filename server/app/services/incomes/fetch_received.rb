module Incomes
  class FetchReceived < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def call
      received_incomes = user.incomes.received_this_month

      { success: true, incomes: received_incomes }
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
