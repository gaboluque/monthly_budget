require 'rails_helper'

RSpec.describe BudgetItem::Update do
  let(:user) { create(:user) }
  let(:budget_item) { create(:budget_item, user: user, name: 'Old Name', amount: 100.00, category: 'needs') }

  let(:valid_params) {
    {
      name: 'New Name',
      amount: 200.00,
      category: 'wants'
    }
  }

  let(:invalid_params) {
    {
      name: '',
      amount: nil,
      category: 'invalid'
    }
  }

  describe '.call' do
    context 'with valid params' do
      it 'updates the budget item' do
        result = described_class.call(budget_item, valid_params)

        expect(result[:success]).to be true
        budget_item.reload
        expect(budget_item.name).to eq('New Name')
        expect(budget_item.amount).to eq(200.00)
        expect(budget_item.category).to eq('wants')
      end
    end

    context 'with invalid params' do
      it 'returns errors' do
        result = described_class.call(budget_item, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end

      it 'does not update the budget item' do
        described_class.call(budget_item, invalid_params)

        budget_item.reload
        expect(budget_item.name).to eq('Old Name')
        expect(budget_item.amount).to eq(100.00)
        expect(budget_item.category).to eq('needs')
      end
    end

    context 'when an exception occurs' do
      before do
        allow(budget_item).to receive(:update).and_raise(StandardError.new('Test error'))
      end

      it 'returns error message' do
        result = described_class.call(budget_item, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
