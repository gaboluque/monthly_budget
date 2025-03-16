require 'rails_helper'

RSpec.describe Accounts::Create, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:valid_params) do
      {
        name: 'Test Account',
        balance: 1000.00,
        account_type: 'Savings',
        currency: 'USD',
        is_owned: true
      }
    end

    context 'with valid parameters' do
      it 'creates a new account' do
        expect {
          Accounts::Create.call(user, valid_params)
        }.to change(Account, :count).by(1)
      end

      it 'returns success and the created account' do
        result = Accounts::Create.call(user, valid_params)

        expect(result[:success]).to be true
        expect(result[:account]).to be_a(Account)
        expect(result[:account].name).to eq(valid_params[:name])
        expect(result[:account].balance).to eq(valid_params[:balance])
        expect(result[:account].account_type).to eq(valid_params[:account_type])
        expect(result[:account].currency).to eq(valid_params[:currency])
        expect(result[:account].is_owned).to eq(valid_params[:is_owned])
        expect(result[:account].user).to eq(user)
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { name: '', balance: -100 } }

      it 'does not create a new account' do
        expect {
          Accounts::Create.call(user, invalid_params)
        }.not_to change(Account, :count)
      end

      it 'returns failure and error messages' do
        result = Accounts::Create.call(user, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Account).to receive(:save).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Accounts::Create.call(user, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
