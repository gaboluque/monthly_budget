require 'rails_helper'

RSpec.describe Incomes::Create, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:valid_params) do
      {
        name: 'Test Income',
        amount: 1000.00,
        frequency: 'monthly',
        account_id: account.id
      }
    end

    context 'with valid parameters' do
      it 'creates a new income' do
        expect {
          Incomes::Create.call(user, valid_params)
        }.to change(Income, :count).by(1)
      end

      it 'returns success and the created income' do
        result = Incomes::Create.call(user, valid_params)

        expect(result[:success]).to be true
        expect(result[:income]).to be_a(Income)
        expect(result[:income].name).to eq(valid_params[:name])
        expect(result[:income].amount).to eq(valid_params[:amount])
        expect(result[:income].frequency).to eq(valid_params[:frequency])
        expect(result[:income].account_id).to eq(valid_params[:account_id])
        expect(result[:income].user).to eq(user)
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { name: '', amount: -100 } }

      it 'does not create a new income' do
        expect {
          Incomes::Create.call(user, invalid_params)
        }.not_to change(Income, :count)
      end

      it 'returns failure and error messages' do
        result = Incomes::Create.call(user, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Income).to receive(:save).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Incomes::Create.call(user, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
