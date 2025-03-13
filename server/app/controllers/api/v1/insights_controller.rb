module Api
  module V1
    class InsightsController < ApplicationController
      def index
        data = {
          # Add your financial data here that you want to analyze
          # For example:
          transactions: Transaction.last_month,
          total_expenses: Transaction.expenses.sum(:amount),
          categories: Transaction.group(:category).sum(:amount)
        }

        messages = [
          { role: 'system', content: 'You are a financial insights analyst. Analyze the provided data and generate meaningful insights.' },
          { role: 'user', content: "Please analyze the following financial data and provide insights:\n#{data.to_json}" }
        ]

        client = ChatGPT::Client.new
        insights = client.completion(messages)

        render json: { insights: insights }
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
end
