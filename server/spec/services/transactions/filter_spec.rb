require 'rails_helper'

RSpec.describe Transactions::Filter do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let!(:expense) { create(:transaction, :expense, user: user, account: account, created_at: 4.days.ago, executed_at: 4.days.ago) }
  let!(:transfer) { create(:transaction, :transfer, user: user, account: account, created_at: 3.days.ago, executed_at: 3.days.ago) }

  describe '.call' do
    it 'returns all transactions for a user' do
      result = described_class.call(user, {})

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(2)
      expect(result[:transactions]).to include(expense, transfer)
    end

    it 'filters by transaction type' do
      result = described_class.call(user, { transaction_type: Transaction.transaction_types[:expense] })

      expect(result[:success]).to be true
      expect(result[:transactions].count).to eq(1)
        expect(result[:transactions]).to include(expense)
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
      expect(result[:transactions].first).to eq(transfer)
      expect(result[:transactions].last).to eq(expense)
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

      expect(result[:transactions].to_a).to eq([ transfer, expense, old_transaction ])
    end
  end
end
