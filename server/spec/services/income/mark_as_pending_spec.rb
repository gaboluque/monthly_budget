require 'rails_helper'

RSpec.describe Incomes::MarkAsPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user, balance: 100) }

    context 'when income is already pending' do
      let!(:income) { create(:income, user: user, account: account, amount: 10, last_received_at: nil) }

      before do
        allow(income).to receive(:pending?).and_return(true)
        allow(income).to receive(:current_month_transaction).and_return(nil)
      end

      it 'returns success without destroying any transaction' do
        result = described_class.call(income)

        expect(result[:success]).to eq(true)
        expect(result[:income].id).to eq(income.id)
      end
    end

    context 'when income has been received and has a transaction' do
      let!(:income) { create(:income, user: user, account: account, amount: 10, last_received_at: 1.day.ago) }
      let!(:transaction) { create(:transaction, user: user, account: account, amount: income.amount, transaction_type: 'income', description: "Income: #{income.name}", item: income) }

      before do
        allow(income).to receive(:pending?).and_return(false)
        allow(income).to receive(:current_month_transaction).and_return(transaction)
      end

      it 'calls the transaction destroy service' do
        expect(Transactions::Destroy).to receive(:call).with(transaction).and_return({
          success: true,
          income: income.reload
        })

        result = described_class.call(income)

        expect(result[:success]).to eq(true)
      end
    end
  end
end
