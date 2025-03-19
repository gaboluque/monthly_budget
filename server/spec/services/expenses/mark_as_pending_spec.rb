require 'rails_helper'

RSpec.describe Expenses::MarkAsPending, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let!(:transaction) { create(:transaction, user: user, account: account, amount: expense.amount, transaction_type: 'expense', description: "Expense: #{expense.name}", item: expense, executed_at: 30.minutes.ago) }

    context 'when expense is pending' do
      let!(:expense) { create(:pending_expense, user: user, account: account) }

      it 'returns success' do
        initial_last_expensed_at = expense.last_expensed_at

        result = described_class.call(expense)
        expect(result[:success]).to eq(true)
        expect(result[:expense].id).to eq(expense.id)
        expect(Transaction.count).to eq(1)
        expect(expense.reload.last_expensed_at).to eq(initial_last_expensed_at)
      end
    end

    context 'when expense has been expensed' do
      let!(:expense) { create(:expensed_expense, user: user, account: account, last_expensed_at: 1.day.ago) }

      it 'marks expense as pending' do
        result = described_class.call(expense)
        expect(result[:success]).to eq(true)
        expect(result[:expense].id).to eq(expense.id)
        expect(Transaction.count).to eq(0)
        expect(expense.reload.last_expensed_at).to be_nil
      end
    end
  end
end
