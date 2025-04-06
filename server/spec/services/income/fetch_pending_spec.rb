require 'rails_helper'

RSpec.describe Income::FetchPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }

    let!(:pending_income1) { create(:income, user: user, account: account, name: 'Pending Income 1', last_received_at: nil) }
    let!(:pending_income2) { create(:income, user: user, account: account, name: 'Pending Income 2', last_received_at: 2.months.ago) }
    let!(:received_income) { create(:income, user: user, account: account, name: 'Received Income', last_received_at: Time.current) }

    before do
      # Ensure the received_income is marked as received in the current month
      received_income.update!(last_received_at: Time.current)
    end

    context 'when user has pending incomes' do
      it 'returns all pending incomes for the user' do
        result = Income::FetchPending.call(user)

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(2)
        expect(result[:incomes]).to include(pending_income1, pending_income2)
        expect(result[:incomes]).not_to include(received_income)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(user).to receive(:incomes).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Income::FetchPending.call(user)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
