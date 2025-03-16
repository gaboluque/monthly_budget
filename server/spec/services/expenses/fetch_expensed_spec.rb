require 'rails_helper'

RSpec.describe Expenses::FetchExpensed, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }

    let!(:expensed_expense1) { create(:expense, user: user, account: account, last_expensed_at: Date.today - 1.day) }
    let!(:expensed_expense2) { create(:expense, user: user, account: account, last_expensed_at: Date.today) }
    let!(:pending_expense) { create(:expense, user: user, account: account, last_expensed_at: nil) }

    context 'when fetching expensed expenses' do
      it 'returns only expensed expenses' do
        result = Expenses::FetchExpensed.call(user)

        expect(result[:success]).to be true
        expect(result[:expenses].count).to eq(2)
        expect(result[:expenses]).to include(expensed_expense1, expensed_expense2)
        expect(result[:expenses]).not_to include(pending_expense)
      end

      it 'orders expenses by last_expensed_at in descending order' do
        result = Expenses::FetchExpensed.call(user)

        expect(result[:success]).to be true
        expect(result[:expenses].first).to eq(expensed_expense2)
        expect(result[:expenses].last).to eq(expensed_expense1)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(user).to receive(:expenses).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Expenses::FetchExpensed.call(user)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
