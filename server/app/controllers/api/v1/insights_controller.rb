module Api
  module V1
    class InsightsController < ApplicationController
      def index
        insights = Rails.cache.fetch("user_#{current_user.id}_budget_insights", expires_in: 1.hour) do
          Insights::BudgetInsightGenerator.new(current_user).generate
        end

        render json: { data: insights }
      end
    end
  end
end
