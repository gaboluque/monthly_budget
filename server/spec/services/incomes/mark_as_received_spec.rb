require 'rails_helper'

RSpec.describe Incomes::MarkAsReceived, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:income) { create(:income, user: user, account: account, last_received_at: nil) }

    context 'when income exists and is pending' do
      before do
        allow(income).to receive(:paid?).and_return(false)
      end

      it 'marks the income as received' do
        expect(income.last_received_at).to be_nil

        result = Incomes::MarkAsReceived.call(income)
        income.reload

        expect(income.last_received_at).not_to be_nil
        expect(income.last_received_at).to be_within(1.minute).of(Time.current)
      end

      it 'returns success and the updated income' do
        result = Incomes::MarkAsReceived.call(income)

        expect(result[:success]).to be true
        expect(result[:income]).to eq(income)
        expect(result[:income].last_received_at).not_to be_nil
      end
    end

    context 'when income is already received in the current month' do
      let(:received_income) { create(:received_income, user: user, account: account) }

      before do
        allow(received_income).to receive(:paid?).and_return(true)
      end

      it 'does not update the received timestamp' do
        original_timestamp = received_income.last_received_at

        result = Incomes::MarkAsReceived.call(received_income)
        received_income.reload

        expect(result[:success]).to be true
        expect(result[:income]).to eq(received_income)
        expect(received_income.last_received_at).to eq(original_timestamp)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(income).to receive(:paid?).and_return(false)
        allow(income).to receive(:update!).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Incomes::MarkAsReceived.call(income)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
