require 'rails_helper'

RSpec.describe Transactions::Destroy do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let!(:transaction) { create(:transaction, user: user, account: account) }

  describe '.call' do
    subject { described_class.call(transaction) }

    it 'destroys the transaction' do
      initial_balance = account.balance

      result = subject

      expect(Transaction.count).to eq(0)
      expect(result[:success]).to be_truthy
      expect(result[:transaction]).to eq(transaction)
      expect(account.reload.transactions).not_to include(transaction)
      expect(account.reload.balance).not_to eq(initial_balance)
    end

    context 'when transaction type is transfer' do
      let(:recipient_account) { create(:account, user: user) }
      let!(:transaction) { create(:transaction, :transfer, user: user, account: account, recipient_account: recipient_account) }

      it 'rolls back the transaction' do
        initial_balance = account.balance
        initial_recipient_balance = recipient_account.balance

        subject

        expect(account.reload.balance).to eq(initial_balance + transaction.amount)
        expect(recipient_account.reload.balance).to eq(initial_recipient_balance - transaction.amount)
      end
    end

    context 'when transaction type is income' do
      let!(:transaction) { create(:transaction, :income, user: user, account: account) }

      it 'rolls back the transaction' do
        initial_balance = account.balance

        subject

        expect(account.reload.balance).to eq(initial_balance - transaction.amount)
      end
    end

    context 'when transaction type is expense' do
      let!(:transaction) { create(:transaction, :expense, user: user, account: account) }

      it 'rolls back the transaction' do
        initial_balance = account.balance

        subject

        expect(account.reload.balance).to eq(initial_balance - transaction.amount)
      end
    end
  end
end
