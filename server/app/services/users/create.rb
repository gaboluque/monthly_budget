module Users
  class Create < ApplicationService
    attr_reader :params

    def initialize(params)
      @params = params
    end

    def call
      ActiveRecord::Base.transaction do
        user = User.create!(params)

        Budgets::Create.call(user, {
          name: 'other',
          amount: 0,
          frequency: 'monthly',
          category: 'other'
        })

        { success: true, user: user }
      end
    end
  end
end
