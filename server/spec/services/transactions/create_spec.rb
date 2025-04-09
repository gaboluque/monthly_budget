require 'rails_helper'

RSpec.describe Transactions::Create do
  let!(:category) { create(:category, id: 0) }
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user, balance: 1000) }
  let(:recipient_account) { create(:account, user: user, balance: 500) }

  let(:valid_params) {
    {
      account_id: account.id,
      amount: 100.50,
      transaction_type: Transaction.transaction_types[:expense],
      description: 'Test expense',
      executed_at: DateTime.now
    }
  }

  let(:invalid_params) {
    {
      account_id: account.id,
      amount: nil,
      transaction_type: Transaction.transaction_types[:expense],
      description: 'Invalid expense'
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

  let(:income_params) {
    {
      account_id: account.id,
      amount: 200.75,
      transaction_type: Transaction.transaction_types[:income],
      description: 'Test income',
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
        expect(transaction.transaction_type).to eq(Transaction.transaction_types[:expense])
        expect(transaction.description).to eq('Test expense')
      end

      it 'sets executed_at to current time if not provided' do
        params_without_executed_at = valid_params.except(:executed_at)
        result = described_class.call(user, params_without_executed_at)

        expect(result[:success]).to be true
        expect(result[:transaction].executed_at).to be_present
        expect(result[:transaction].executed_at).to be_within(5.seconds).of(Time.current)
      end

      it 'updates account balance for expense transactions' do
        expect {
          described_class.call(user, valid_params)
        }.to change { account.reload.balance }.from(1000).to(899.50)
      end

      it 'updates account balance for income transactions' do
        expect {
          described_class.call(user, income_params)
        }.to change { account.reload.balance }.from(1000).to(1200.75)
      end

      it 'creates a transfer with recipient and updates both account balances' do
        expect {
          result = described_class.call(user, transfer_params)

          expect(result[:success]).to be true
          transaction = result[:transaction]
          expect(transaction.transaction_type).to eq(Transaction.transaction_types[:transfer])
          expect(transaction.recipient_account).to eq(recipient_account)
        }.to change { account.reload.balance }.from(1000).to(949.75)
        .and change { recipient_account.reload.balance }.from(500).to(550.25)
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

      it 'does not change account balance' do
        expect {
          described_class.call(user, invalid_params)
        }.not_to change { account.reload.balance }
      end
    end
  end
end
