require 'rails_helper'

RSpec.describe Transactions::Destroy do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user, balance: 1000) }
  let!(:transaction) { create(:transaction, user: user, account: account, amount: 100) }

  describe '.call' do
    subject { described_class.call(transaction) }

    it 'destroys the transaction' do
      expect { subject }.to change(Transaction, :count).by(-1)

      result = subject
      expect(result[:success]).to be_truthy
      expect(result[:transaction]).to eq(transaction)
    end

    context 'when transaction type is transfer' do
      let(:recipient_account) { create(:account, user: user, balance: 500) }
      let!(:transaction) do
        create(:transaction, :transfer,
          user: user,
          account: account,
          recipient_account: recipient_account,
          amount: 100
        )
      end

      before do
        # Simulate the balances after a transfer was created
        account.update!(balance: 900)  # 1000 - 100
        recipient_account.update!(balance: 600)  # 500 + 100
      end

      it 'rolls back the transaction correctly' do
        subject

        expect(account.reload.balance).to eq(1000)
        expect(recipient_account.reload.balance).to eq(500)
      end
    end

    context 'when transaction type is income' do
      let!(:transaction) do
        create(:transaction, :income,
          user: user,
          account: account,
          amount: 100
        )
      end

      before do
        # Simulate the balance after an income was created
        account.update!(balance: 1100)  # 1000 + 100
      end

      it 'rolls back the transaction correctly' do
        subject

        expect(account.reload.balance).to eq(1000)
      end
    end

    context 'when transaction type is expense' do
      let!(:transaction) do
        create(:transaction, :expense,
          user: user,
          account: account,
          amount: 100
        )
      end

      before do
        # Simulate the balance after an expense was created
        account.update!(balance: 900)  # 1000 - 100
      end

      it 'rolls back the transaction correctly' do
        subject

        expect(account.reload.balance).to eq(1000)
      end
    end
  end
end
