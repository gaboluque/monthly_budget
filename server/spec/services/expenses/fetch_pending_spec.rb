require 'rails_helper'

RSpec.describe Expenses::FetchPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }

    let!(:pending_expense1) { create(:expense, user: user, account: account, last_expensed_at: nil) }
    let!(:pending_expense2) { create(:expense, user: user, account: account, last_expensed_at: nil) }
    let!(:expensed_expense) { create(:expense, user: user, account: account, last_expensed_at: Date.today) }

    context 'when fetching pending expenses' do
      it 'returns only pending expenses' do
        result = Expenses::FetchPending.call(user)

        expect(result[:success]).to be true
        expect(result[:expenses].count).to eq(2)
        expect(result[:expenses]).to include(pending_expense1, pending_expense2)
        expect(result[:expenses]).not_to include(expensed_expense)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(user).to receive(:expenses).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Expenses::FetchPending.call(user)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
