require 'rails_helper'

RSpec.describe Transactions::Filter do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let!(:deposit) { create(:transaction, :deposit, user: user, account: account, created_at: 4.days.ago) }
  let!(:withdrawal) { create(:transaction, :withdrawal, user: user, account: account, created_at: 3.days.ago) }

  describe '.call' do
    it 'returns all transactions for a user' do
      result = described_class.call(user, {})

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(2)
      expect(result[:transactions]).to include(deposit, withdrawal)
    end

    it 'filters by transaction type' do
      result = described_class.call(user, { transaction_type: Transaction.transaction_types[:deposit] })

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(1)
      expect(result[:transactions]).to include(deposit)
    end

    it 'filters by date range' do
      old_transaction = create(:transaction,
        user: user,
        account: account,
        executed_at: 3.months.ago,
        created_at: 3.months.ago
      )

      result = described_class.call(user, {
        start_date: 1.month.ago,
        end_date: 1.day.ago
      })

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(2)
      expect(result[:transactions]).not_to include(old_transaction)
      expect(result[:transactions].first).to eq(withdrawal)
      expect(result[:transactions].last).to eq(deposit)
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
      old_transaction = create(:transaction,
        user: user,
        account: account,
        executed_at: 2.months.ago,
        created_at: 2.months.ago
      )

      result = described_class.call(user, {})

      expect(result[:transactions].to_a).to eq([ withdrawal, deposit, old_transaction ])
    end
  end
end
