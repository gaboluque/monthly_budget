require 'rails_helper'

RSpec.describe Accounts::Filter, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let!(:checking_account) { create(:account, account_type: 'Checking', user: user) }
    let!(:savings_account) { create(:account, account_type: 'Savings', user: user) }
    let!(:usd_account) { create(:account, currency: 'USD', user: user) }
    let!(:eur_account) { create(:account, currency: 'EUR', user: user) }
    let!(:owned_account) { create(:account, is_owned: true, user: user) }
    let!(:not_owned_account) { create(:account, is_owned: false, user: user) }

    context 'with no filters' do
      it 'returns all user accounts' do
        result = Accounts::Filter.call(user)

        expect(result[:success]).to be true
        expect(result[:accounts].count).to eq(6)
      end
    end

    context 'with account_type filter' do
      it 'returns accounts of the specified type' do
        result = Accounts::Filter.call(user, { account_type: 'Checking' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to include(checking_account)
        expect(result[:accounts]).not_to include(savings_account)
      end
    end

    context 'with currency filter' do
      it 'returns accounts with the specified currency' do
        result = Accounts::Filter.call(user, { currency: 'USD' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to include(usd_account)
        expect(result[:accounts]).not_to include(eur_account)
      end
    end

    context 'with owned filter set to true' do
      it 'returns owned accounts' do
        result = Accounts::Filter.call(user, { owned: 'true' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to include(owned_account)
        expect(result[:accounts]).not_to include(not_owned_account)
      end
    end

    context 'with owned filter set to false' do
      it 'returns not owned accounts' do
        result = Accounts::Filter.call(user, { owned: 'false' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to include(not_owned_account)
        expect(result[:accounts]).not_to include(owned_account)
      end
    end

    context 'with multiple filters' do
      let!(:checking_usd_owned) { create(:account, account_type: 'Checking', currency: 'USD', is_owned: true, user: user) }

      it 'applies all filters' do
        result = Accounts::Filter.call(user, { account_type: 'Checking', currency: 'USD', owned: 'true' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to include(checking_usd_owned)
        expect(result[:accounts].count).to eq(2)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(user).to receive(:accounts).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Accounts::Filter.call(user)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
