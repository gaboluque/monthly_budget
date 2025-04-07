module Api
  module V1
    class InsightsController < ApplicationController
      def index
        insights = Rails.cache.fetch("user_#{current_user.id}_budget_insights", expires_in: 1.hour) do
          Insights::BudgetInsightGenerator.new(current_user).generate
        end

        render json: { data: insights }
      end

      def monthly_balance
        incomes = current_user.transactions.incomes.current_month
        expenses = current_user.transactions.expenses.current_month

        total_income = incomes.sum(:amount)
        total_expenses = expenses.sum(:amount)
        monthly_balance = total_income - total_expenses

        render json: {
          data: {
            monthly_balance: monthly_balance,
            incomes: {
              total: total_income,
            },
            expenses: {
              total: total_expenses,
            },
          }
        }
      end
    end
  end
end
