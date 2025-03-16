require 'rails_helper'

RSpec.describe Incomes::Filter, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account1) { create(:account, user: user, name: 'Account 1') }
    let(:account2) { create(:account, user: user, name: 'Account 2') }

    let!(:income1) { create(:income, user: user, account: account1, name: 'Salary', amount: 3000, frequency: 'monthly') }
    let!(:income2) { create(:income, user: user, account: account1, name: 'Bonus', amount: 1000, frequency: 'yearly') }
    let!(:income3) { create(:income, user: user, account: account2, name: 'Freelance', amount: 500, frequency: 'weekly') }
    let!(:income4) { create(:income, user: user, account: account2, name: 'Dividend', amount: 200, frequency: 'quarterly') }

    context 'with no filters' do
      it 'returns all incomes for the user' do
        result = Incomes::Filter.call(user, {})

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(4)
        expect(result[:incomes]).to include(income1, income2, income3, income4)
      end
    end

    context 'with account filter' do
      it 'returns incomes for the specified account' do
        result = Incomes::Filter.call(user, { account_id: account1.id })

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(2)
        expect(result[:incomes]).to include(income1, income2)
        expect(result[:incomes]).not_to include(income3, income4)
      end
    end

    context 'with frequency filter' do
      it 'returns incomes with the specified frequency' do
        result = Incomes::Filter.call(user, { frequency: 'monthly' })

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(1)
        expect(result[:incomes]).to include(income1)
        expect(result[:incomes]).not_to include(income2, income3, income4)
      end
    end

    context 'with name filter' do
      it 'returns incomes with names containing the search term' do
        result = Incomes::Filter.call(user, { name: 'sal' })

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(1)
        expect(result[:incomes]).to include(income1)
        expect(result[:incomes]).not_to include(income2, income3, income4)
      end
    end

    context 'with multiple filters' do
      it 'returns incomes matching all filters' do
        result = Incomes::Filter.call(user, { account_id: account1.id, frequency: 'monthly' })

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(1)
        expect(result[:incomes]).to include(income1)
        expect(result[:incomes]).not_to include(income2, income3, income4)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(user).to receive(:incomes).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Incomes::Filter.call(user, {})

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
