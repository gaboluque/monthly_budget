require 'rails_helper'

RSpec.describe Budgets::Create do
  let(:user) { create(:user) }

  let(:valid_params) {
    {
      name: 'Monthly Rent',
      amount: 1500.00,
      frequency: 'monthly'
    }
  }

  let(:invalid_params) {
    {
      name: '',
      amount: nil,
      frequency: 'yearly'
    }
  }

  describe '.call' do
    context 'with valid params' do
      it 'creates a new budget item' do
        expect {
          result = described_class.call(user, valid_params)
          expect(result[:success]).to be true
          expect(result[:budget]).to be_persisted
        }.to change(Budget, :count).by(1)
      end

      it 'correctly assigns attributes' do
        result = described_class.call(user, valid_params)

        budget = result[:budget]
        expect(budget.user).to eq(user)
        expect(budget.name).to eq('Monthly Rent')
        expect(budget.amount).to eq(1500.00)
        expect(budget.frequency).to eq('monthly')
      end
    end

    context 'with invalid params' do
      it 'returns errors' do
        result = described_class.call(user, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end

      it 'does not create a budget item' do
        expect {
          described_class.call(user, invalid_params)
        }.not_to change(Budget, :count)
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Budget).to receive(:save).and_raise(StandardError.new('Test error'))
      end

      it 'returns error message' do
        result = described_class.call(user, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
