module Api
  module V1
    class InsightsController < ApplicationController
      def index
        insights = Rails.cache.fetch("user_#{current_user.id}_budget_insights", expires_in: 1.hour) do
          Insight::BudgetInsightGenerator.new(current_user).generate
        end

        render json: { data: insights }
      end

      def monthly_balance
        incomes = current_user.transactions.incomes.current_month
        expenses = current_user.transactions.expenses.current_month
        budget_items = current_user.budget_items

        balance_by_category = BudgetItem::DEFAULT_CATEGORIES.each_with_object({}) do |category, acc|
          budget_amount = budget_items.where(category: category).sum(:amount)
          monthly_expenses = expenses.joins(:budget_item).where(budget_items: { category: category }).sum(:amount)
          remaining = budget_amount - monthly_expenses
          percentage_used = budget_amount.zero? ? 0 : (monthly_expenses / budget_amount * 100).round(1)
          
          status = if budget_amount.zero?
                    'no_budget'
                  elsif percentage_used > 100
                    'over_budget'
                  elsif percentage_used >= 80
                    'warning'
                  else
                    'on_track'
                  end
          
          acc[category] = {
            budget_amount: budget_amount,
            monthly_expenses: monthly_expenses,
            remaining: remaining,
            percentage_used: percentage_used,
            status: status
          }
        end

        total_income = incomes.sum(:amount)
        total_expenses = expenses.sum(:amount)
        monthly_balance = total_income - total_expenses

        render json: {
          data: {
            incomes: {
              total: total_income,
              transactions: incomes
            },
            expenses: {
              total: total_expenses,
              transactions: expenses
            },
            monthly_balance: monthly_balance,
            balance_by_category: balance_by_category
          }
        }
      end
    end
  end
end
