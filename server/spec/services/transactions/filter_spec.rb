require 'rails_helper'

RSpec.describe Transactions::Filter do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let(:deposit) { create(:transaction, user: user, account: account, transaction_type: 'Deposit') }
  let(:withdrawal) { create(:transaction, user: user, account: account, transaction_type: 'Withdrawal') }

  describe '.call' do
    before do
      deposit
      withdrawal
    end

    it 'returns all transactions for a user' do
      result = described_class.call(user, {})

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(2)
      expect(result[:transactions]).to include(deposit, withdrawal)
    end

    it 'filters by transaction type' do
      result = described_class.call(user, { transaction_type: 'Deposit' })

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(1)
      expect(result[:transactions]).to include(deposit)
    end

    it 'filters by date range' do
      old_transaction = create(:transaction,
        user: user,
        account: account,
        executed_at: 2.months.ago
      )

      result = described_class.call(user, {
        start_date: 1.month.ago,
        end_date: Date.tomorrow
      })

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(2)
      expect(result[:transactions]).not_to include(old_transaction)
    end

    it 'filters by account' do
      other_account = create(:account, user: user)
      other_account_transaction = create(:transaction, user: user, account: other_account)

      result = described_class.call(user, { account_id: account.id })

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(2)
      expect(result[:transactions]).not_to include(other_account_transaction)
    end

    it 'returns transactions ordered by execution date (newest first)' do
      # Clear existing transactions to start fresh
      Transaction.delete_all

      # Create with explicitly different dates to ensure reliable ordering
      old_transaction = create(:transaction,
        user: user,
        account: account,
        executed_at: 30.days.ago
      )

      middle_transaction = create(:transaction,
        user: user,
        account: account,
        executed_at: 15.days.ago
      )

      new_transaction = create(:transaction,
        user: user,
        account: account,
        executed_at: 1.day.ago
      )

      result = described_class.call(user, {})

      # Use an array comparison to check the exact ordering
      expect(result[:transactions].to_a).to eq([ new_transaction, middle_transaction, old_transaction ])
    end
  end
end
