require 'rails_helper'

RSpec.describe Accounts::Filter, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let!(:checking_account) { create(:account, :checking, user: user) }
    let!(:savings_account) { create(:account, :savings, user: user) }
    let!(:credit_card_account) { create(:account, :credit_card, user: user) }
    let!(:usd_account) { create(:account, :usd, user: user) }
    let!(:eur_account) { create(:account, :eur, user: user) }
    let!(:owned_account) { create(:account, :owned, user: user) }
    let!(:not_owned_account) { create(:account, :not_owned, user: user) }

    context 'with no filters' do
      it 'returns all user accounts' do
        result = Accounts::Filter.call(user)

        expect(result[:success]).to be true
        expect(result[:accounts].count).to eq(7) # Total number of accounts created for this user
      end
    end

    context 'with account_type filter' do
      it 'returns accounts of the specified type' do
        result = Accounts::Filter.call(user, { account_type: 'checking' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to include(checking_account)
        expect(result[:accounts]).not_to include(savings_account)
        expect(result[:accounts]).not_to include(credit_card_account)
      end

      it 'returns empty collection for non-matching account type' do
        result = Accounts::Filter.call(user, { account_type: 'investment' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to be_empty
      end
    end

    context 'with currency filter' do
      it 'returns accounts with the specified currency' do
        result = Accounts::Filter.call(user, { currency: 'usd' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to include(usd_account)
        expect(result[:accounts]).not_to include(eur_account)
      end

      it 'returns empty collection for non-matching currency' do
        # Create an account with COP currency to ensure test isolation
        cop_account = create(:account, :cop, user: create(:user))

        result = Accounts::Filter.call(user, { currency: 'cop' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to be_empty
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
      let!(:checking_usd_owned) { create(:account, :checking, :usd, :owned, user: user) }
      let!(:checking_usd_not_owned) { create(:account, :checking, :usd, :not_owned, user: user) }

      it 'applies all filters' do
        result = Accounts::Filter.call(user, { account_type: 'checking', currency: 'usd', owned: 'true' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to include(checking_usd_owned)
        expect(result[:accounts]).not_to include(checking_usd_not_owned)
      end

      it 'returns empty collection when no accounts match all filters' do
        result = Accounts::Filter.call(user, { account_type: 'investment', currency: 'cop', owned: 'true' })

        expect(result[:success]).to be true
        expect(result[:accounts]).to be_empty
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
