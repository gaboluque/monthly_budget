module Users
  class Onboarding < ApplicationService
    ONBOARDING_PROMPT = <<~PROMPT
      You are a financial advisor. You are helping a user to onboard to Pluto (a monthly budget app).
      The user has already created an account and is ready to start setting up their budget.
      They have answered some questions and provided some information.

      I need you to create some data taking into account the user's answers and information.

      Valid category names are:
       - Other
       - Food & Drinks
       - Shopping
       - Housing
       - Transportation
       - Health
       - Entertainment
       - Education
       - Travel
       - Pets
       - Gifts
       - Vehicle
         - Fuel
         - Maintenance
       - Investments
       - Savings
       - Income
       - Subscriptions
    PROMPT

    attr_reader :user, :onboarding_params

    def initialize(user, onboarding_params)
      @user = user
      @onboarding_params = onboarding_params
    end

    def call
      client = ChatGpt::Client.new
      messages = build_messages

      puts "PARAMS: #{onboarding_params}"
      puts "MESSAGES: #{messages}"

      json = client.get_json_response(messages, onboarding_response_schema)

      data = JSON.parse(json)


      puts "DATA: #{data}"

      ActiveRecord::Base.transaction do
        accounts_results = data["accounts"].map do |account|
          Accounts::Create.call(user, account)
        end

        data["incomes"].each do |income|
          Incomes::Create.call(user, income.merge(account: accounts_results.first[:account]))
        end

        data["budgets"].each do |budget|
          category_ids = Category.where(name: budget["categories"]).pluck(:id)
          budget["category_ids"] = category_ids
          budget.delete("categories")

          Budgets::Create.call(user, budget)
        end

        user.update!(onboarding_completed_at: Time.current)
      end

      { success: true }
    rescue StandardError => e
      { success: false, errors: [e.message] }
    end


    private

    def build_messages
      [
        { role: "system", content: ONBOARDING_PROMPT },
        { role: "user", content: build_user_prompt }
      ]
    end

    def build_user_prompt
      "Here is the information the user has provided: #{onboarding_params.to_json}"
    end

    def onboarding_response_schema
      {
        type: "object",
        properties: {
          accounts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                balance: { type: "number" },
                account_type: {
                  type: "string",
                  enum: [ "savings", "checking", "credit_card", "loan", "investment", "other" ]
                },
                description: { type: "string" }
              },
              required: [ "name", "balance", "account_type", "description" ],
              additionalProperties: false
            },
            additionalProperties: false
          },
          incomes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                amount: { type: "number" },
                frequency: {
                  type: "string",
                  enum: [ "monthly" ]
                }
              },
              required: [ "name", "amount", "frequency" ],
              additionalProperties: false
            },
            additionalProperties: false
          },
          budgets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                amount: { type: "number" },
                nature: { type: "string" },
                categories: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [ "Other", "Food & Drinks", "Shopping", "Housing", "Transportation", "Health", "Entertainment", "Education", "Travel", "Pets", "Gifts", "Vehicle", "Investments", "Savings", "Income", "Subscriptions" ]
                  }
                }
              },
              required: [ "name", "amount", "nature", "categories" ],
              additionalProperties: false
            },
            additionalProperties: false
          }
        },
        required: [ "accounts", "incomes", "budgets" ],
        additionalProperties: false
      }
    end
  end
end
