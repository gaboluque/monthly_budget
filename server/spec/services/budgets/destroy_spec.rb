require 'rails_helper'

RSpec.describe Budgets::Destroy do
  let(:user) { create(:user) }
  let(:budget) { create(:budget, user: user) }

  describe '.call' do
    context 'when budget item exists' do
      it 'destroys the budget item' do
        # Store the ID before calling destroy for verification
        item_id = budget.id

        expect {
          result = described_class.call(budget)
          expect(result[:success]).to be true
          expect(result[:budget]).to eq(budget)
        }.to change { Budget.exists?(item_id) }.from(true).to(false)
      end
    end

    context 'when destroy fails' do
      before do
        allow(budget).to receive(:destroy).and_return(false)
        allow(budget).to receive(:errors).and_return(
          instance_double('ActiveModel::Errors', empty?: false, full_messages: [ 'Cannot delete this item' ])
        )
      end

      it 'returns errors' do
        result = described_class.call(budget)

        expect(result[:success]).to be false
        expect(result[:errors]).not_to be_empty
      end

      it 'does not destroy the budget item' do
        expect {
          described_class.call(budget)
        }.not_to change(Budget, :count)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(budget).to receive(:destroy).and_raise(StandardError.new('Test error'))
      end

      it 'returns error message' do
        result = described_class.call(budget)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
