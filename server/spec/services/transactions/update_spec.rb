require 'rails_helper'

RSpec.describe Transactions::Update do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user, balance: 900) }
  let(:new_account) { create(:account, user: user, balance: 500) }
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
      executed_at: nil  # This will make validation fail for sure
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

    context 'with various transaction attributes' do
      let(:executed_at) { 2.days.ago }

      it 'updates executed_at correctly' do
        params = { executed_at: executed_at }
        result = described_class.call(transaction, params)

        expect(result[:success]).to be true
        expect(transaction.reload.executed_at.to_i).to eq(executed_at.to_i)
      end

      it 'updates transaction_type correctly' do
        params = { transaction_type: Transaction.transaction_types[:income] }
        result = described_class.call(transaction, params)

        expect(result[:success]).to be true
        expect(transaction.reload.transaction_type).to eq(Transaction.transaction_types[:income])
      end

      it 'updates category correctly' do
        params = { category: Transaction.categories[:needs] }
        result = described_class.call(transaction, params)

        expect(result[:success]).to be true
        expect(transaction.reload.category).to eq(Transaction.categories[:needs])
      end
    end

    context 'with invalid params' do
      it 'should not allow updating with invalid attributes' do
        result = described_class.call(transaction, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
        expect(transaction.reload.amount).to eq(100)
        expect(transaction.reload.description).to eq('Original')
      end
    end
  end
end
