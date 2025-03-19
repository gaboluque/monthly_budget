require 'rails_helper'

RSpec.describe Transactions::Formatter do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user, name: 'Test Account') }
  let(:recipient_account) { create(:account, user: user, name: 'Recipient Account') }
  let(:transaction) { create(:transaction, user: user, account: account, amount: 100, description: 'Test transaction') }
  let(:transfer) { create(:transaction, :transfer, user: user, account: account, recipient_account: recipient_account) }

  describe '.call' do
    it 'formats a transaction with account information' do
      result = described_class.call(transaction)

      expect(result[:success]).to be true
      expect(result[:formatted_transaction]).to be_a(Hash)

      # Test core transaction attributes
      formatted = result[:formatted_transaction]
      expect(formatted["id"]).to eq(transaction.id)
      expect(formatted["amount"]).to eq(transaction.amount.to_s)
      expect(formatted["transaction_type"]).to eq(transaction.transaction_type)
      expect(formatted["description"]).to eq(transaction.description)

      # Test account association
      expect(formatted[:account]).to be_present
      account_data = formatted[:account]
      expect(account_data["id"]).to eq(account.id)
      expect(account_data["name"]).to eq('Test Account')
    end

    it 'includes recipient account for transfers' do
      result = described_class.call(transfer)

      expect(result[:success]).to be true
      formatted = result[:formatted_transaction]

      # Test recipient account
      expect(formatted[:recipient_account]).to be_present
      recipient_data = formatted[:recipient_account]
      expect(recipient_data["id"]).to eq(recipient_account.id)
      expect(recipient_data["name"]).to eq('Recipient Account')
    end

    it 'does not include recipient account for non-transfers' do
      result = described_class.call(transaction)

      expect(result[:success]).to be true
      expect(result[:formatted_transaction][:recipient_account]).to be_nil
    end

    it 'handles exceptions gracefully' do
      allow(transaction).to receive(:as_json).and_raise(StandardError.new('Test error'))

      result = described_class.call(transaction)

      expect(result[:success]).to be false
      expect(result[:errors]).to eq('Test error')
    end
  end
end
