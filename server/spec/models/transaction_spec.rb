# == Schema Information
#
# Table name: transactions
#
#  id                   :bigint           not null, primary key
#  amount               :decimal(10, 2)   not null
#  category             :string
#  description          :text
#  executed_at          :datetime         not null
#  frequency            :string           default("one_time")
#  item_type            :string
#  transaction_type     :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  account_id           :bigint           not null
#  item_id              :bigint
#  recipient_account_id :bigint
#  user_id              :bigint           not null
#
# Indexes
#
#  index_transactions_on_account_id            (account_id)
#  index_transactions_on_category              (category)
#  index_transactions_on_frequency             (frequency)
#  index_transactions_on_item                  (item_type,item_id)
#  index_transactions_on_recipient_account_id  (recipient_account_id)
#  index_transactions_on_transaction_type      (transaction_type)
#  index_transactions_on_user_id               (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (recipient_account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Transaction, type: :model do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let(:recipient_account) { create(:account, user: user) }
  let(:income) { create(:income, user: user, account: account) }
  let(:budget_item) { create(:budget_item, user: user, account: account) }

  describe 'validations' do
    it { should validate_presence_of(:amount) }
    it { should validate_presence_of(:transaction_type) }
    it { should validate_presence_of(:executed_at) }
    it { should validate_numericality_of(:amount) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:account) }
    it { should belong_to(:recipient_account).optional }
    it { should belong_to(:item).optional }
  end

  describe 'custom validations' do
    context 'when transaction is a transfer' do
      let(:transaction) { build(:transaction, transaction_type: Transaction.transaction_types[:transfer], user: user, account: account) }

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
      let(:transaction) { build(:transaction, transaction_type: Transaction.transaction_types[:expense], user: user, account: account) }

      it 'does not require a recipient account' do
        expect(transaction).to be_valid
      end
    end

    context 'when transaction is an income' do
      let(:transaction) { build(:transaction, transaction_type: Transaction.transaction_types[:income], user: user, account: account) }

      it 'requires an income item' do
        expect(transaction).not_to be_valid
        expect(transaction.errors[:item]).to include('must be associated with an income')
      end

      it 'is valid with an income item' do
        transaction.item = income
        expect(transaction).to be_valid
      end

      it 'is invalid with a non-income item' do
        transaction.item = budget_item
        expect(transaction).not_to be_valid
        expect(transaction.errors[:item]).to include('must be an Income for income transactions')
      end
    end
  end

  describe '#income' do
    it 'returns the item when it is an income transaction with an income item' do
      transaction = build(:transaction, :income, user: user, account: account, item: income)
      expect(transaction.income).to eq(income)
    end

    it 'returns nil when not an income transaction' do
      transaction = build(:transaction, :expense, user: user, account: account, item: expense)
      expect(transaction.income).to be_nil
    end
  end


  describe '#item_name' do
    it 'returns the name of the associated item' do
      transaction = build(:transaction, :income, user: user, account: account, item: income)
      expect(transaction.item_name).to eq(income.name)
    end

    it 'returns nil when no item is associated' do
      transaction = build(:transaction, :expense, user: user, account: account)
      expect(transaction.item_name).to be_nil
    end
  end
end
