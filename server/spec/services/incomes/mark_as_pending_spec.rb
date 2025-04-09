require 'rails_helper'

RSpec.describe Incomes::MarkAsPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user, balance: 100) }

    context 'when income is already pending' do
      let!(:income) { create(:income, user: user, account: account, amount: 10, last_received_at: nil) }

      before do
        allow(income).to receive(:pending?).and_return(true)
      end

      it 'returns success and marks the income as pending' do
        result = described_class.call(income)

        expect(result[:success]).to eq(true)
        expect(result[:income].id).to eq(income.id)
      end
    end

    context 'when income has been received this month' do
      let!(:income) { create(:income, user: user, account: account, amount: 10, last_received_at: 1.day.ago) }

      it 'returns success and marks the income as pending' do
        result = described_class.call(income)

        expect(result[:success]).to eq(true)
        expect(income.reload.pending?).to be_truthy
      end
    end
  end
end
