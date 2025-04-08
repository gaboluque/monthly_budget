require 'rails_helper'

RSpec.describe Accounts::Update, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, :savings, :usd, :owned, user: user) }
    let(:valid_params) do
      {
        name: 'Updated Account',
        balance: 2000.00,
        account_type: 'checking',
        currency: 'eur',
        is_owned: false
      }
    end

    context 'with valid parameters' do
      it 'updates the account' do
        result = Accounts::Update.call(account, valid_params)
        account.reload

        expect(account.name).to eq(valid_params[:name])
        expect(account.balance).to eq(valid_params[:balance])
        expect(account.account_type).to eq(valid_params[:account_type])
        expect(account.currency).to eq(valid_params[:currency])
        expect(account.is_owned).to eq(valid_params[:is_owned])
      end

      it 'returns success and the updated account' do
        result = Accounts::Update.call(account, valid_params)

        expect(result[:success]).to be true
        expect(result[:account]).to eq(account)
      end

      it 'handles partial updates correctly' do
        partial_params = { name: 'Partially Updated Account' }
        original_balance = account.balance
        original_type = account.account_type

        result = Accounts::Update.call(account, partial_params)
        account.reload

        expect(result[:success]).to be true
        expect(account.name).to eq('Partially Updated Account')
        expect(account.balance).to eq(original_balance)
        expect(account.account_type).to eq(original_type)
      end

      it 'updates to different account types' do
        account_types = %w[checking credit_card loan investment other]

        account_types.each do |type|
          test_account = create(:account, user: user)
          params = { account_type: type }

          result = Accounts::Update.call(test_account, params)
          test_account.reload

          expect(result[:success]).to be true
          expect(test_account.account_type).to eq(type)
        end
      end

      it 'updates to different currencies' do
        currencies = %w[usd eur cop]

        currencies.each do |currency|
          test_account = create(:account, user: user)
          params = { currency: currency }

          result = Accounts::Update.call(test_account, params)
          test_account.reload

          expect(result[:success]).to be true
          expect(test_account.currency).to eq(currency)
        end
      end

      it 'updates ownership status' do
        # Test changing from owned to not owned
        owned_account = create(:account, :owned, user: user)
        result = Accounts::Update.call(owned_account, { is_owned: false })
        owned_account.reload

        expect(result[:success]).to be true
        expect(owned_account.is_owned).to be false

        # Test changing from not owned to owned
        not_owned_account = create(:account, :not_owned, user: user)
        result = Accounts::Update.call(not_owned_account, { is_owned: true })
        not_owned_account.reload

        expect(result[:success]).to be true
        expect(not_owned_account.is_owned).to be true
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { name: '', balance: -100 } }

      it 'does not update the account' do
        original_name = account.name
        original_balance = account.balance

        Accounts::Update.call(account, invalid_params)
        account.reload

        expect(account.name).to eq(original_name)
        expect(account.balance).to eq(original_balance)
      end

      it 'returns failure and error messages' do
        result = Accounts::Update.call(account, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
        expect(result[:errors]).to include("Name can't be blank")
        expect(result[:errors]).to include("Balance must be greater than or equal to 0")
      end

      it 'validates account_type enum values' do
        invalid_type_params = { account_type: 'invalid_type' }
        original_type = account.account_type

        result = Accounts::Update.call(account, invalid_type_params)
        account.reload

        expect(result[:success]).to be false
        expect(result[:errors]).to include("'invalid_type' is not a valid account_type")
        expect(account.account_type).to eq(original_type)
      end

      it 'validates currency enum values' do
        invalid_currency_params = { currency: 'invalid_currency' }
        original_currency = account.currency

        result = Accounts::Update.call(account, invalid_currency_params)
        account.reload

        expect(result[:success]).to be false
        expect(result[:errors]).to include("'invalid_currency' is not a valid currency")
        expect(account.currency).to eq(original_currency)
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Account).to receive(:update).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Accounts::Update.call(account, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
