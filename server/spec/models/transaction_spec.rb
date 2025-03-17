require 'rails_helper'

RSpec.describe Transaction, type: :model do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let(:recipient_account) { create(:account, user: user) }

  describe 'validations' do
    it { should validate_presence_of(:amount) }
    it { should validate_presence_of(:transaction_type) }
    it { should validate_presence_of(:executed_at) }
    it { should validate_numericality_of(:amount) }
    it { should validate_inclusion_of(:transaction_type).in_array(Transaction::TRANSACTION_TYPES) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:account) }
    it { should belong_to(:recipient_account).optional }
  end

  describe 'custom validations' do
    context 'when transaction is a transfer' do
      let(:transaction) { build(:transaction, transaction_type: 'Transfer', user: user, account: account) }

      it 'requires a recipient account' do
        expect(transaction).not_to be_valid
        expect(transaction.errors[:recipient_account]).to include('must be present for transfer transactions')
      end

      it 'is valid with a recipient account' do
        transaction.recipient_account = recipient_account
        expect(transaction).to be_valid
      end
    end

    context 'when transaction is not a transfer' do
      let(:transaction) { build(:transaction, transaction_type: 'Deposit', user: user, account: account) }

      it 'does not require a recipient account' do
        expect(transaction).to be_valid
      end
    end
  end
end
