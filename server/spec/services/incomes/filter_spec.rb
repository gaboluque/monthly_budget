require 'rails_helper'

RSpec.describe Incomes::Filter, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account1) { create(:account, user: user) }
    let(:account2) { create(:account, user: user) }

    let!(:income1) { create(:income, user: user, account: account1, name: 'Salary', frequency: 'monthly') }
    let!(:income2) { create(:income, user: user, account: account1, name: 'Bonus', frequency: 'yearly') }
    let!(:income3) { create(:income, user: user, account: account2, name: 'Side Job', frequency: 'monthly') }
    let!(:income4) { create(:income, user: user, account: account2, name: 'Dividend', frequency: 'quarterly') }

    context 'when no filter params are provided' do
      it 'returns all incomes for the user' do
        result = Incomes::Filter.call(user)

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(4)
        expect(result[:incomes]).to include(income1, income2, income3, income4)
      end
    end

    context 'when filtering by account' do
      it 'returns incomes for the specified account' do
        result = Incomes::Filter.call(user, account_id: account1.id)

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(2)
        expect(result[:incomes]).to include(income1, income2)
        expect(result[:incomes]).not_to include(income3, income4)
      end
    end

    context 'when filtering by frequency' do
      it 'returns incomes with the specified frequency' do
        result = Incomes::Filter.call(user, frequency: 'monthly')

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(2)
        expect(result[:incomes]).to include(income1, income3)
        expect(result[:incomes]).not_to include(income2, income4)
      end
    end

    context 'when filtering by name' do
      it 'returns incomes with the specified name pattern' do
        result = Incomes::Filter.call(user, name: 'sal')

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(1)
        expect(result[:incomes]).to include(income1)
        expect(result[:incomes]).not_to include(income2, income3, income4)
      end

      it 'is case insensitive when filtering by name' do
        result = Incomes::Filter.call(user, name: 'SIDE')

        expect(result[:success]).to be true
        expect(result[:incomes].count).to eq(1)
        expect(result[:incomes]).to include(income3)
      end
    end

    context 'when combining multiple filters' do
      it 'applies all filters together' do
        result = Incomes::Filter.call(user, account_id: account1.id, frequency: 'monthly')

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
        result = Incomes::Filter.call(user)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
