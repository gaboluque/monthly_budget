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
        incomes = current_user.incomes.current_month
        expenses = current_user.transactions.expenses.current_month
        budget_items = current_user.budget_items

        balance_by_category = BudgetItem::DEFAULT_CATEGORIES.each_with_object({}) do |category, acc|
          acc[category] = {
            budget_amount: budget_items.where(category: category).sum(:amount),
            monthly_expenses: expenses.where(category: category).sum(:amount)
          }
        end

        render json: {
          data: {
            incomes: incomes,
            expenses: expenses,
            balance: incomes.sum(:amount) - expenses.sum(:amount),
            balance_by_category: balance_by_category
          }
        }
      end
    end
  end
end
