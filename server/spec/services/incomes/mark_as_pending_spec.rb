require 'rails_helper'

RSpec.describe Incomes::MarkAsPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user, balance: 100) }
    let!(:transaction) { create(:transaction, user: user, account: account, amount: income.amount, transaction_type: 'income', description: "Income: #{income.name}", item: income) }

    context 'when income is pending' do
      let!(:income) { create(:pending_income, user: user, account: account, amount: 10) }

      it 'returns success' do
        initial_last_received_at = income.last_received_at

        result = described_class.call(income)
        expect(result[:success]).to eq(true)
        expect(result[:income].id).to eq(income.id)
        expect(Transaction.count).to eq(1)
        expect(income.reload.last_received_at).to eq(initial_last_received_at)
      end
    end

    context 'when income is has not been received' do
      let!(:income) { create(:received_income, user: user, account: account, last_received_at: 1.day.ago, amount: 10) }

      it 'marks income as pending' do
        result = described_class.call(income)
        expect(result[:success]).to eq(true)
        expect(result[:income].id).to eq(income.id)
        expect(Transaction.count).to eq(0)
        expect(income.reload.last_received_at).to be_nil
      end
    end
  end
end
