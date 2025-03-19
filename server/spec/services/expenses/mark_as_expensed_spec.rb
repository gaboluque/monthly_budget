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

      it 'creates a transaction record' do
        expect {
          result = Expenses::MarkAsExpensed.call(expense)
        }.to change(Transaction, :count).by(1)

        transaction = Transaction.last
        expect(transaction.user).to eq(user)
        expect(transaction.account).to eq(account)
        expect(transaction.amount).to eq(expense.amount)
        expect(transaction.transaction_type).to eq('expense')
        expect(transaction.description).to eq("Expense: #{expense.name}")
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

      it 'does not create a transaction record' do
        expect {
          result = Expenses::MarkAsExpensed.call(expensed_expense)
        }.not_to change(Transaction, :count)
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

    context 'when transaction creation fails' do
      before do
        allow_any_instance_of(Transactions::Create).to receive(:call).and_return({
          success: false,
          errors: [ 'Transaction creation failed' ]
        })
      end

      it 'rolls back the changes and returns error' do
        expect {
          result = Expenses::MarkAsExpensed.call(expense)

          expect(result[:success]).to be false
          expect(result[:errors]).to include('Failed to create transaction')

          expense.reload
          expect(expense.last_expensed_at).to be_nil
        }.not_to change(Transaction, :count)
      end
    end
  end
end
