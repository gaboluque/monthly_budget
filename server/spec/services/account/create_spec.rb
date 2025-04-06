require 'rails_helper'

RSpec.describe Account::Create, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:valid_params) do
      {
        name: 'Test Account',
        balance: 1000.00,
        account_type: 'savings',
        currency: 'usd',
        is_owned: true
      }
    end

    context 'with valid parameters' do
      it 'creates a new account' do
        expect {
          Account::Create.call(user, valid_params)
        }.to change(Account, :count).by(1)
      end

      it 'returns success and the created account' do
        result = Account::Create.call(user, valid_params)

        expect(result[:success]).to be true
        expect(result[:account]).to be_a(Account)
        expect(result[:account].name).to eq(valid_params[:name])
        expect(result[:account].balance).to eq(valid_params[:balance])
        expect(result[:account].account_type).to eq(valid_params[:account_type])
        expect(result[:account].currency).to eq(valid_params[:currency])
        expect(result[:account].is_owned).to eq(valid_params[:is_owned])
        expect(result[:account].user).to eq(user)
      end

      it 'uses default values when not provided' do
        minimal_params = {
          name: 'Minimal Test Account',
          balance: 500.00
        }

        result = Account::Create.call(user, minimal_params)

        expect(result[:success]).to be true
        expect(result[:account].name).to eq(minimal_params[:name])
        expect(result[:account].balance).to eq(minimal_params[:balance])
        expect(result[:account].account_type).to eq('savings') # default from the model
        expect(result[:account].currency).to eq('cop') # default from the model
        expect(result[:account].is_owned).to eq(true) # default from the model
      end

      it 'creates different account types' do
        account_types = %w[checking credit_card loan investment other]

        account_types.each do |type|
          params = valid_params.merge(account_type: type)
          result = Account::Create.call(user, params)

          expect(result[:success]).to be true
          expect(result[:account].account_type).to eq(type)
        end
      end

      it 'creates accounts with different currencies' do
        currencies = %w[usd eur cop]

        currencies.each do |currency|
          params = valid_params.merge(currency: currency)
          result = Account::Create.call(user, params)

          expect(result[:success]).to be true
          expect(result[:account].currency).to eq(currency)
        end
      end

      it 'creates owned and not owned accounts' do
        [ true, false ].each do |owned_status|
          params = valid_params.merge(is_owned: owned_status)
          result = Account::Create.call(user, params)

          expect(result[:success]).to be true
          expect(result[:account].is_owned).to eq(owned_status)
        end
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { name: '', balance: -100 } }

      it 'does not create a new account' do
        expect {
          Account::Create.call(user, invalid_params)
        }.not_to change(Account, :count)
      end

      it 'returns failure and error messages' do
        result = Account::Create.call(user, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
        expect(result[:errors]).to include("Name can't be blank")
        expect(result[:errors]).to include("Balance must be greater than or equal to 0")
      end

      it 'validates account_type enum values' do
        invalid_type_params = valid_params.merge(account_type: 'invalid_type')

        expect {
          Account::Create.call(user, invalid_type_params)
        }.not_to change(Account, :count)

        result = Account::Create.call(user, invalid_type_params)
        expect(result[:success]).to be false
        expect(result[:errors]).to include("'invalid_type' is not a valid account_type")
      end

      it 'validates currency enum values' do
        invalid_currency_params = valid_params.merge(currency: 'invalid_currency')

        expect {
          Account::Create.call(user, invalid_currency_params)
        }.not_to change(Account, :count)

        result = Account::Create.call(user, invalid_currency_params)
        expect(result[:success]).to be false
        expect(result[:errors]).to include("'invalid_currency' is not a valid currency")
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Account).to receive(:save).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Account::Create.call(user, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
