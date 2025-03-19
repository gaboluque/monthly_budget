# == Schema Information
#
# Table name: incomes
#
#  id               :bigint           not null, primary key
#  amount           :decimal(15, 2)   not null
#  frequency        :string           not null
#  last_received_at :datetime
#  name             :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  account_id       :bigint           not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_incomes_on_account_id  (account_id)
#  index_incomes_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Income, type: :model do
  describe 'validations' do
    subject { build(:income) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:amount) }
    it { should validate_numericality_of(:amount).is_greater_than(0) }
    it { should validate_presence_of(:frequency) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:account) }
    it { should have_many(:transactions).dependent(:nullify) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:income)).to be_valid
    end
  end

  describe 'with transactions' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:income) { create(:income, user: user, account: account) }

    it 'can have associated transactions' do
      transaction = create(:transaction, :income, user: user, account: account, item: income)
      expect(income.transactions).to include(transaction)
      expect(transaction.item).to eq(income)
    end

    it 'keeps transactions when income is destroyed but sets item to nil' do
      transaction = create(:transaction, :income, user: user, account: account, item: income)
      transaction_id = transaction.id
      income.destroy

      reloaded_transaction = Transaction.find(transaction_id)
      expect(reloaded_transaction).to be_present
      expect(reloaded_transaction.item).to be_nil
    end
  end

  describe 'scopes' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }

    describe '.pending and .received_this_month' do
      let(:current_month_start) { Time.current.beginning_of_month }
      let(:current_month_end) { Time.current.end_of_month }
      let(:last_month) { 1.month.ago }

      let!(:pending_income) { create(:income, last_received_at: last_month, user: user, account: account) }
      let!(:received_income) { create(:income, last_received_at: Time.current, user: user, account: account) }
      let!(:nil_income) { create(:income, last_received_at: nil, user: user, account: account) }

      it '.pending returns incomes not received in the current month' do
        expect(Income.pending).to include(pending_income)
        expect(Income.pending).to include(nil_income)
        expect(Income.pending).not_to include(received_income)
      end

      it '.received_this_month returns incomes received in the current month' do
        expect(Income.received_this_month).to include(received_income)
        expect(Income.received_this_month).not_to include(pending_income)
        expect(Income.received_this_month).not_to include(nil_income)
      end
    end
  end
end
