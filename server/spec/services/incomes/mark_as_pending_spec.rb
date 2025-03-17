require 'rails_helper'

RSpec.describe Incomes::MarkAsPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user, balance: 100) }
    let(:income) { create(:income, user: user, account: account, last_received_at: Time.current, amount: 10) }
    let!(:transaction) { create(:transaction, user: user, account: account, amount: income.amount, transaction_type: 'income', description: "Income: #{income.name}", item: income) }

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

      it 'removes the associated transaction' do
        expect {
          result = Incomes::MarkAsPending.call(income)
        }.to change(Transaction, :count).by(-1)
      end

      it 'updates the account balance' do
        result = Incomes::MarkAsPending.call(income)
        account.reload

        expect(result[:success]).to be true
        expect(account.balance).to eq(90)
      end
    end

    context 'when income is already pending' do
      let(:pending_income) { create(:pending_income, user: user, account: account) }

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

      it 'does not remove any transactions' do
        expect {
          result = Incomes::MarkAsPending.call(pending_income)
        }.not_to change(Transaction, :count)
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

    context 'when transaction removal fails' do
      before do
        @transaction = create(:transaction,
          user: user,
          account: account,
          amount: income.amount,
          transaction_type: 'income',
          description: "Income: #{income.name}",
          item: income
        )

        allow_any_instance_of(Account).to receive(:update!).and_raise(StandardError.new('Test error'))
      end

      it 'does not update the balance' do
        initial_balance = account.balance

        result = Incomes::MarkAsPending.call(income)

        income.reload
        account.reload

        expect(income.last_received_at).not_to be_nil
        expect(account.balance).to eq(initial_balance)
        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
