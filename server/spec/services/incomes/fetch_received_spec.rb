require 'rails_helper'

RSpec.describe Incomes::FetchReceived, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }

    let!(:received_income1) { create(:income, user: user, account: account, name: 'Received Income 1', last_received_at: Time.current) }
    let!(:received_income2) { create(:income, user: user, account: account, name: 'Received Income 2', last_received_at: Time.current.beginning_of_month) }
    let!(:pending_income1) { create(:income, user: user, account: account, name: 'Pending Income 1', last_received_at: nil) }
    let!(:pending_income2) { create(:income, user: user, account: account, name: 'Pending Income 2', last_received_at: 2.months.ago) }

    context 'when user has received incomes' do
      it 'returns all received incomes for the user in the current month' do
        result = Incomes::FetchReceived.call(user)

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(2)
        expect(result[:incomes]).to include(received_income1, received_income2)
        expect(result[:incomes]).not_to include(pending_income1, pending_income2)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(user).to receive(:incomes).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Incomes::FetchReceived.call(user)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
