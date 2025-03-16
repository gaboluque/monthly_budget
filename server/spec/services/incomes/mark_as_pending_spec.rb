require 'rails_helper'

RSpec.describe Incomes::MarkAsPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:income) { create(:income, user: user, account: account, last_received_at: Time.current) }

    context 'when income exists and is received' do
      it 'marks the income as pending' do
        expect(income.last_received_at).not_to be_nil

        result = Incomes::MarkAsPending.call(income)
        income.reload

        expect(income.last_received_at).to be_nil
      end

      it 'returns success and the updated income' do
        result = Incomes::MarkAsPending.call(income)

        expect(result[:success]).to be true
        expect(result[:income]).to eq(income)
        expect(result[:income].last_received_at).to be_nil
      end
    end

    context 'when income is already pending' do
      let(:pending_income) { create(:income, user: user, account: account, last_received_at: nil) }

      it 'keeps the income as pending' do
        expect(pending_income.last_received_at).to be_nil

        result = Incomes::MarkAsPending.call(pending_income)
        pending_income.reload

        expect(pending_income.last_received_at).to be_nil
      end

      it 'returns success and the unchanged income' do
        result = Incomes::MarkAsPending.call(pending_income)

        expect(result[:success]).to be true
        expect(result[:income]).to eq(pending_income)
        expect(result[:income].last_received_at).to be_nil
      end
    end

    context 'when an exception occurs' do
      before do
        allow(income).to receive(:update!).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Incomes::MarkAsPending.call(income)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
