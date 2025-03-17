require 'rails_helper'

RSpec.describe Expense, type: :model do
  describe 'validations' do
    subject { build(:expense) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:amount) }
    it { should validate_numericality_of(:amount).is_greater_than_or_equal_to(0) }
    it { should validate_presence_of(:category) }
    it { should validate_presence_of(:frequency) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:account).optional }
    it { should have_many(:transactions).dependent(:nullify) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:expense)).to be_valid
    end
  end

  describe 'with transactions' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:expense) { create(:expense, user: user, account: account) }

    it 'can have associated transactions' do
      transaction = create(:transaction, :expense, user: user, account: account, item: expense)
      expect(expense.transactions).to include(transaction)
      expect(transaction.item).to eq(expense)
    end

    it 'keeps transactions when expense is destroyed but sets item to nil' do
      transaction = create(:transaction, :expense, user: user, account: account, item: expense)
      transaction_id = transaction.id
      expense.destroy

      reloaded_transaction = Transaction.find(transaction_id)
      expect(reloaded_transaction).to be_present
      expect(reloaded_transaction.item).to be_nil
    end
  end

  describe 'scopes' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:other_account) { create(:account, user: user) }

    let!(:needs_expense) { create(:expense, category: 'Needs', user: user) }
    let!(:wants_expense) { create(:expense, category: 'Wants', user: user) }
    let!(:monthly_expense) { create(:expense, frequency: 'monthly', user: user) }
    let!(:weekly_expense) { create(:expense, frequency: 'weekly', user: user) }
    let!(:account_expense) { create(:expense, account: account, user: user) }

    describe '.by_category' do
      it 'returns expenses of the specified category' do
        expect(Expense.by_category('Needs')).to include(needs_expense)
        expect(Expense.by_category('Needs')).not_to include(wants_expense)
      end
    end

    describe '.by_frequency' do
      it 'returns expenses with the specified frequency' do
        expect(Expense.by_frequency('monthly')).to include(monthly_expense)
        expect(Expense.by_frequency('monthly')).not_to include(weekly_expense)
      end
    end

    describe '.by_account' do
      it 'returns expenses for the specified account' do
        expect(Expense.by_account(account.id)).to include(account_expense)
        expect(Expense.by_account(other_account.id)).not_to include(account_expense)
      end
    end

    describe '.pending and .expensed' do
      let(:current_month_start) { Time.current.beginning_of_month }
      let(:current_month_end) { Time.current.end_of_month }
      let(:last_month) { 1.month.ago }

      let!(:pending_expense) { create(:expense, last_expensed_at: last_month, user: user) }
      let!(:expensed_expense) { create(:expense, last_expensed_at: Time.current, user: user) }
      let!(:nil_expense) { create(:expense, last_expensed_at: nil, user: user) }

      it '.pending returns expenses not expensed in the current month' do
        expect(Expense.pending).to include(pending_expense)
        expect(Expense.pending).to include(nil_expense)
        expect(Expense.pending).not_to include(expensed_expense)
      end

      it '.expensed returns expenses expensed in the current month' do
        expect(Expense.expensed).to include(expensed_expense)
        expect(Expense.expensed).not_to include(pending_expense)
        expect(Expense.expensed).not_to include(nil_expense)
      end
    end
  end
end
