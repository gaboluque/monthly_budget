require 'rails_helper'

RSpec.describe Expenses::MarkAsExpensed, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user, balance: 1000) }
    let(:expense) { create(:expense, user: user, account: account, amount: 100, last_expensed_at: nil) }

    context 'when marking an expense as expensed' do
      it 'sets last_expensed_at to current date' do
        expect(expense.last_expensed_at).to be_nil

        result = Expenses::MarkAsExpensed.call(expense)
        expense.reload

        expect(expense.last_expensed_at).to be_within(1.second).of(DateTime.current)
      end

      it 'updates the account balance' do
        original_balance = account.balance

        result = Expenses::MarkAsExpensed.call(expense)
        account.reload

        expect(account.balance).to eq(original_balance + expense.amount)
      end

      it 'returns success and the updated expense' do
        result = Expenses::MarkAsExpensed.call(expense)

        expect(result[:success]).to be true
        expect(result[:expense]).to eq(expense)
        expect(result[:expense].last_expensed_at).to be_within(1.second).of(DateTime.current)
      end
    end

    context 'when the expense is already expensed' do
      let(:expensed_date) { Date.today - 1.day }
      let(:expensed_expense) { create(:expense, user: user, account: account, last_expensed_at: expensed_date, amount: 100) }

      it 'does not update the account or last_expensed_at' do
        original_balance = account.balance

        result = Expenses::MarkAsExpensed.call(expensed_expense)
        account.reload

        expect(account.balance).to eq(original_balance)
        expect(expensed_expense.last_expensed_at).to eq(expensed_date)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(expense).to receive(:update!).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Expenses::MarkAsExpensed.call(expense)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
