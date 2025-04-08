require 'rails_helper'

RSpec.describe Insights::BudgetInsightGenerator, type: :service do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let(:income) { create(:income, user: user, account: account) }
  let(:budget) { create(:budget, user: user) }
  let(:transaction) { create(:transaction, user: user, account: account) }
  
  let(:chat_gpt_client_instance) { instance_double(ChatGpt::Client) }
  let(:mock_completion) { "Here are your financial insights..." }

  before do
    # Setup necessary associations
    user.accounts << account
    user.incomes << income
    user.budgets << budget
    user.transactions << transaction
    
    # Mock ChatGpt::Client
    allow(ChatGpt::Client).to receive(:new).and_return(chat_gpt_client_instance)
    allow(chat_gpt_client_instance).to receive(:get_completion).and_return(mock_completion)
  end

  describe '#generate' do
    it 'initializes a ChatGpt::Client' do
      generator = Insights::BudgetInsightGenerator.new(user)
      generator.generate
      
      expect(ChatGpt::Client).to have_received(:new)
    end
    
    it 'calls get_completion with the correct messages' do
      generator = Insights::BudgetInsightGenerator.new(user)
      generator.generate
      
      expect(chat_gpt_client_instance).to have_received(:get_completion) do |messages|
        expect(messages.length).to eq(2)
        expect(messages[0][:role]).to eq("system")
        expect(messages[0][:content]).to include("You are a financial insights analyst")
        expect(messages[1][:role]).to eq("user")
        expect(messages[1][:content]).to include("Please analyze the following financial data")
      end
    end
    
    it 'returns the completion from ChatGpt::Client' do
      generator = Insights::BudgetInsightGenerator.new(user)
      result = generator.generate
      
      expect(result).to eq(mock_completion)
    end
    
    it 'includes account data in the prompt' do
      allow(chat_gpt_client_instance).to receive(:get_completion) do |messages|
        user_message = messages[1][:content]
        expect(user_message).to include('"name":"' + account.name + '"')
        expect(user_message).to include('"type":"' + account.account_type + '"')
        expect(user_message).to include('"balance":"' + account.balance.to_s + '"')
        mock_completion
      end
      
      generator = Insights::BudgetInsightGenerator.new(user)
      generator.generate
    end
    
    it 'includes income data in the prompt' do
      allow(chat_gpt_client_instance).to receive(:get_completion) do |messages|
        user_message = messages[1][:content]
        expect(user_message).to include('"name":"' + income.name + '"')
        expect(user_message).to include('"amount":"' + income.amount.to_s + '"')
        expect(user_message).to include('"frequency":"' + income.frequency + '"')
        mock_completion
      end
      
      generator = Insights::BudgetInsightGenerator.new(user)
      generator.generate
    end
    
    it 'includes budget data in the prompt' do
      allow(chat_gpt_client_instance).to receive(:get_completion) do |messages|
        user_message = messages[1][:content]
        expect(user_message).to include('"name":"' + budget.name + '"')
        expect(user_message).to include('"amount":"' + budget.amount.to_s + '"')
        expect(user_message).to include('"frequency":"' + budget.frequency + '"')
        mock_completion
      end
      
      generator = Insights::BudgetInsightGenerator.new(user)
      generator.generate
    end
    
    it 'includes transaction data in the prompt' do
      allow(chat_gpt_client_instance).to receive(:get_completion) do |messages|
        user_message = messages[1][:content]
        expect(user_message).to include('"amount":"' + transaction.amount.to_s + '"')
        # Account for JSON escaping of ampersand
        category_name = transaction.category.name.gsub('&', '\u0026')
        expect(user_message).to include('"category":"' + category_name + '"')
        expect(user_message).to include('"frequency":"' + transaction.frequency + '"')
        expect(user_message).to include('"transaction_type":"' + transaction.transaction_type + '"')
        mock_completion
      end
      
      generator = Insights::BudgetInsightGenerator.new(user)
      generator.generate
    end
  end
end 