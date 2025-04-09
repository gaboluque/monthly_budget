module Budgets
  class Create < ApplicationService
    attr_reader :user, :params

    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      category_ids = params.delete(:category_ids)
      budget = user.budgets.build(params)

      ActiveRecord::Base.transaction do
        if budget.save
          category_ids.each do |category_id|
            budget.categories << Category.find(category_id)
          end

          { success: true, budget: budget }
        else
          { success: false, errors: budget.errors }
        end
      end
    rescue StandardError => e
      { success: false, errors: e.message }
    end
  end
end
