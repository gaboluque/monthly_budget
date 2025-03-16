require 'rails_helper'

RSpec.describe Expenses::Filter, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account1) { create(:account, user: user, name: 'Account 1') }
    let(:account2) { create(:account, user: user, name: 'Account 2') }

    let!(:expense1) { create(:expense, user: user, account: account1, name: 'Expense 1', category: 'Needs', amount: 100) }
    let!(:expense2) { create(:expense, user: user, account: account1, name: 'Expense 2', category: 'Wants', amount: 200) }
    let!(:expense3) { create(:expense, user: user, account: account2, name: 'Expense 3', category: 'Needs', amount: 300) }
    let!(:expense4) { create(:expense, user: user, account: account2, name: 'Expense 4', category: 'Savings', amount: 400) }

    context 'with no filters' do
      it 'returns all expenses for the user' do
        result = Expenses::Filter.call(user, {})

        expect(result[:success]).to be true
        expect(result[:expenses].count).to eq(4)
        expect(result[:expenses]).to include(expense1, expense2, expense3, expense4)
      end
    end

    context 'with account_id filter' do
      it 'returns expenses for the specified account' do
        result = Expenses::Filter.call(user, { account_id: account1.id })

        expect(result[:success]).to be true
        expect(result[:expenses].count).to eq(2)
        expect(result[:expenses]).to include(expense1, expense2)
        expect(result[:expenses]).not_to include(expense3, expense4)
      end
    end

    context 'with category filter' do
      it 'returns expenses for the specified category' do
        result = Expenses::Filter.call(user, { category: 'Needs' })

        expect(result[:success]).to be true
        expect(result[:expenses].count).to eq(2)
        expect(result[:expenses]).to include(expense1, expense3)
        expect(result[:expenses]).not_to include(expense2, expense4)
      end
    end

    context 'with multiple filters' do
      it 'returns expenses matching all filters' do
        result = Expenses::Filter.call(user, { account_id: account1.id, category: 'Needs' })

        expect(result[:success]).to be true
        expect(result[:expenses].count).to eq(1)
        expect(result[:expenses]).to include(expense1)
        expect(result[:expenses]).not_to include(expense2, expense3, expense4)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(user).to receive(:expenses).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Expenses::Filter.call(user, {})

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
