require 'rails_helper'

RSpec.describe Users::Create, type: :service do
  describe '#call' do
    let(:valid_params) do
      {
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      }
    end

    context 'with valid parameters' do
      before do
        # Mock the BudgetItems::Create service
        allow(BudgetItems::Create).to receive(:call).and_return({ success: true, budget: build(:budget) })
      end

      it 'creates a new user' do
        expect {
          Users::Create.call(valid_params)
        }.to change(User, :count).by(1)
      end

      it 'returns success and the created user' do
        result = Users::Create.call(valid_params)

        expect(result[:success]).to be true
        expect(result[:user]).to be_a(User)
        expect(result[:user].email).to eq(valid_params[:email])
      end

      it 'calls BudgetItems::Create with the new user and correct parameters' do
        user = nil
        allow(BudgetItems::Create).to receive(:call) do |u, params|
          user = u
          { success: true, budget: build(:budget) }
        end

        result = Users::Create.call(valid_params)
        
        expect(BudgetItems::Create).to have_received(:call)
        expect(user).to eq(result[:user])
        expect(user).to be_a(User)
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { email: 'invalid', password: 'short' } }

      it 'does not create a new user' do
        expect {
          Users::Create.call(invalid_params)
        }.not_to change(User, :count)
      end

      it 'returns failure with errors' do
        result = Users::Create.call(invalid_params)
        
        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end

      it 'does not call BudgetItems::Create' do
        allow(BudgetItems::Create).to receive(:call)
        Users::Create.call(invalid_params)
        
        expect(BudgetItems::Create).not_to have_received(:call)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(User).to receive(:create!).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure with the error message' do
        result = Users::Create.call(valid_params)
        
        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end 