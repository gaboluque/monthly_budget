require 'rails_helper'

RSpec.describe BudgetItems::Update do
  let(:user) { create(:user) }
  let(:budget) { create(:budget, user: user, name: 'Old Name', amount: 100.00) }

  let(:valid_params) {
    {
      name: 'New Name',
      amount: 200.00,
    }
  }

  let(:invalid_params) {
    {
      name: '',
      amount: nil,
    }
  }

  describe '.call' do
    context 'with valid params' do
      it 'updates the budget item' do
        result = described_class.call(budget, valid_params)

        expect(result[:success]).to be true
        budget.reload
        expect(budget.name).to eq('New Name')
        expect(budget.amount).to eq(200.00)
      end
    end

    context 'with invalid params' do
      it 'returns errors' do
        result = described_class.call(budget, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end

      it 'does not update the budget item' do
        described_class.call(budget, invalid_params)

        budget.reload
        expect(budget.name).to eq('Old Name')
        expect(budget.amount).to eq(100.00)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(budget).to receive(:update).and_raise(StandardError.new('Test error'))
      end

      it 'returns error message' do
        result = described_class.call(budget, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
