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
      
      def budget_usage
        # Calculate budget usage based on transactions
        budgets = current_user.budgets.includes(:categories)
        transactions = current_user.transactions.current_month.includes(:category)
        
        # Create a hash to store budget usage
        budgets_usage = {}
        
        budgets.each do |budget|
          # Initialize usage for each budget
          budgets_usage[budget.name] = {
            id: budget.id,
            name: budget.name,
            amount: budget.amount.to_f,
            usage_amount: 0,
            nature: budget.nature,
            percentage: 0
          }
          
          # Calculate usage based on transactions for categories in this budget
          budget.categories.each do |category|
            # Find transactions for this category and add amounts to budget usage
            category_transactions = transactions.select { |transaction| transaction.category_id == category.id }
            
            if category_transactions.any?
              category_transactions.each do |transaction|
                budgets_usage[budget.name][:usage_amount] += transaction.amount.to_f if transaction.expense?
              end
            end
          end
          
          # Calculate percentage

          if budget.amount > 0
            budgets_usage[budget.name][:percentage] = (budgets_usage[budget.name][:usage_amount] / budget.amount) * 100
            puts "budget.amount: #{budget.amount}"
            puts "budgets_usage[budget.name][:usage_amount]: #{budgets_usage[budget.name][:usage_amount]}"
            puts "budgets_usage[budget.name][:percentage]: #{budgets_usage[budget.name][:percentage]}"
          end
        end
        
        render json: {
          data: budgets_usage
        }
      end
    end
  end
end
