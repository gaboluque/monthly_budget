require 'rails_helper'

RSpec.describe Transactions::Create do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let(:recipient_account) { create(:account, user: user) }

  let(:valid_params) {
    {
      account_id: account.id,
      amount: 100.50,
      transaction_type: Transaction.transaction_types[:deposit],
      description: 'Test deposit',
      executed_at: DateTime.now
    }
  }

  let(:invalid_params) {
    {
      account_id: account.id,
      amount: nil,
      transaction_type: Transaction.transaction_types[:deposit],
      description: 'Invalid deposit'
    }
  }

  let(:transfer_params) {
    {
      account_id: account.id,
      recipient_account_id: recipient_account.id,
      amount: 50.25,
      transaction_type: Transaction.transaction_types[:transfer],
      description: 'Test transfer',
      executed_at: DateTime.now
    }
  }

  describe '.call' do
    context 'with valid params' do
      it 'creates a new transaction' do
        expect {
          result = described_class.call(user, valid_params)
          expect(result[:success]).to be true
          expect(result[:transaction]).to be_persisted
        }.to change(Transaction, :count).by(1)
      end

      it 'correctly assigns attributes' do
        result = described_class.call(user, valid_params)

        transaction = result[:transaction]
        expect(transaction.user).to eq(user)
        expect(transaction.account).to eq(account)
        expect(transaction.amount).to eq(100.50)
        expect(transaction.transaction_type).to eq(Transaction.transaction_types[:deposit])
        expect(transaction.description).to eq('Test deposit')
      end

      it 'creates a transfer with recipient' do
        result = described_class.call(user, transfer_params)

        expect(result[:success]).to be true
        transaction = result[:transaction]
        expect(transaction.transaction_type).to eq(Transaction.transaction_types[:transfer])
        expect(transaction.recipient_account).to eq(recipient_account)
      end
    end

    context 'with invalid params' do
      it 'returns errors' do
        result = described_class.call(user, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end

      it 'does not create a transaction' do
        expect {
          described_class.call(user, invalid_params)
        }.not_to change(Transaction, :count)
      end
    end
  end
end
