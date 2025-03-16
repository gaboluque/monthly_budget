require 'rails_helper'

RSpec.describe Accounts::Update, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:valid_params) do
      {
        name: 'Updated Account',
        balance: 2000.00,
        account_type: 'Checking',
        currency: 'EUR',
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
