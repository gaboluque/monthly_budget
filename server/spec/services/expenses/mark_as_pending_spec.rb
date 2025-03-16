require 'rails_helper'

RSpec.describe Expenses::MarkAsPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:expense) { create(:expense, user: user, account: account, last_expensed_at: Date.today) }

    context 'when marking an expense as pending' do
      it 'sets last_expensed_at to nil' do
        expect(expense.last_expensed_at).not_to be_nil

        result = Expenses::MarkAsPending.call(expense)
        expense.reload

        expect(expense.last_expensed_at).to be_nil
      end

      it 'returns success and the updated expense' do
        result = Expenses::MarkAsPending.call(expense)

        expect(result[:success]).to be true
        expect(result[:expense]).to eq(expense)
        expect(result[:expense].last_expensed_at).to be_nil
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
  end
end
