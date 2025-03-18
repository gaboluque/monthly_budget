# == Schema Information
#
# Table name: accounts
#
#  id           :bigint           not null, primary key
#  account_type :string           not null
#  balance      :decimal(15, 2)   not null
#  currency     :string           default("COP"), not null
#  description  :text
#  is_owned     :boolean          default(TRUE), not null
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_accounts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Account, type: :model do
  describe 'validations' do
    subject { build(:account) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:balance) }
    it { should validate_numericality_of(:balance).is_greater_than_or_equal_to(0) }
    it { should validate_presence_of(:account_type) }
    it { should validate_presence_of(:currency) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:account)).to be_valid
    end
  end

  describe 'scopes' do
    let(:user) { create(:user) }
    let!(:checking_account) { create(:account, account_type: 'Checking', user: user) }
    let!(:savings_account) { create(:account, account_type: 'Savings', user: user) }
    let!(:usd_account) { create(:account, currency: 'USD', user: user) }
    let!(:eur_account) { create(:account, currency: 'EUR', user: user) }
    let!(:owned_account) { create(:account, is_owned: true, user: user) }
    let!(:not_owned_account) { create(:account, is_owned: false, user: user) }

    describe '.by_type' do
      it 'returns accounts of the specified type' do
        expect(Account.by_type('Checking')).to include(checking_account)
        expect(Account.by_type('Checking')).not_to include(savings_account)
      end
    end

    describe '.by_currency' do
      it 'returns accounts with the specified currency' do
        expect(Account.by_currency('USD')).to include(usd_account)
        expect(Account.by_currency('USD')).not_to include(eur_account)
      end
    end

    describe '.owned' do
      it 'returns accounts that are owned' do
        expect(Account.owned).to include(owned_account)
        expect(Account.owned).not_to include(not_owned_account)
      end
    end

    describe '.not_owned' do
      it 'returns accounts that are not owned' do
        expect(Account.not_owned).to include(not_owned_account)
        expect(Account.not_owned).not_to include(owned_account)
      end
    end
  end
end
