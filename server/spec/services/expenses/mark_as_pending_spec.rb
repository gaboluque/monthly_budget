require 'rails_helper'

RSpec.describe Expenses::MarkAsPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:expense) { create(:expense, user: user, account: account, last_expensed_at: Date.today) }
    let!(:transaction) { create(:transaction, user: user, account: account, amount: expense.amount, transaction_type: 'expense', description: "Expense: #{expense.name}", item: expense) }

    context 'when marking an expense as pending' do
      it 'returns success and the updated expense' do
        result = Expenses::MarkAsPending.call(expense)

        expect(result[:success]).to be true
        expect(result[:expense]).to eq(expense)
        expect(result[:expense].last_expensed_at).to be_nil
      end

      it 'removes the associated transaction' do
        expect {
          result = Expenses::MarkAsPending.call(expense)
        }.to change(Transaction, :count).by(-1)
      end

      it 'updates the account balance' do
        initial_balance = account.balance

        result = Expenses::MarkAsPending.call(expense)
        account.reload

        expect(account.balance).to eq(initial_balance - expense.amount)
      end
    end

    context 'when the expense is already pending' do
      let(:pending_expense) { create(:expense, user: user, account: account, last_expensed_at: nil) }

      it 'keeps last_expensed_at as nil' do
        expect(pending_expense.last_expensed_at).to be_nil

        result = Expenses::MarkAsPending.call(pending_expense)
        pending_expense.reload

        expect(pending_expense.last_expensed_at).to be_nil
      end

      it 'returns success and the expense' do
        result = Expenses::MarkAsPending.call(pending_expense)

        expect(result[:success]).to be true
        expect(result[:expense]).to eq(pending_expense)
      end

      it 'does not remove any transactions' do
        expect {
          result = Expenses::MarkAsPending.call(pending_expense)
        }.not_to change(Transaction, :count)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(expense).to receive(:update!).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Expenses::MarkAsPending.call(expense)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end

    context 'when transaction removal fails' do
      before do
        allow_any_instance_of(Account).to receive(:update!).and_raise(StandardError.new('Test error'))
      end

      it 'does not update the balance' do
        initial_balance = account.balance

        result = Expenses::MarkAsPending.call(expense)
        account.reload

        expect(account.balance).to eq(initial_balance)
        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
