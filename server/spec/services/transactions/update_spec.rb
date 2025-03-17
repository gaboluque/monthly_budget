require 'rails_helper'

RSpec.describe Transactions::Update do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let(:new_account) { create(:account, user: user) }
  let(:transaction) { create(:transaction, user: user, account: account, amount: 100, description: 'Original') }

  let(:valid_params) {
    {
      amount: 200.75,
      description: 'Updated description'
    }
  }

  let(:invalid_params) {
    {
      amount: nil,
      transaction_type: 'Invalid'
    }
  }

  let(:account_change_params) {
    {
      account_id: new_account.id
    }
  }

  describe '.call' do
    context 'with valid params' do
      it 'updates the transaction' do
        result = described_class.call(transaction, valid_params)

        expect(result[:success]).to be true
        transaction.reload
        expect(transaction.amount).to eq(200.75)
        expect(transaction.description).to eq('Updated description')
      end

      it 'can change the transaction account' do
        result = described_class.call(transaction, account_change_params)

        expect(result[:success]).to be true
        transaction.reload
        expect(transaction.account).to eq(new_account)
      end
    end

    context 'with invalid params' do
      it 'returns errors' do
        result = described_class.call(transaction, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end

      it 'does not update the transaction' do
        original_amount = transaction.amount
        original_description = transaction.description

        described_class.call(transaction, invalid_params)
        transaction.reload

        expect(transaction.amount).to eq(original_amount)
        expect(transaction.description).to eq(original_description)
      end
    end
  end
end
