require 'rails_helper'

RSpec.describe Transaction::Destroy do
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

    context 'when transaction is associated with a budget item' do
      let(:budget_item) { create(:budget_item, user: user, last_paid_at: Date.yesterday) }
      let!(:transaction) do
        create(:transaction, :expense,
          user: user,
          account: account,
          amount: 100,
          item: budget_item
        )
      end

      before do
        # Simulate the balance after an expense was created
        account.update!(balance: 900)
      end

      it 'marks the budget item as pending' do
        expect(budget_item.last_paid_at).to be_present

        subject

        expect(budget_item.reload.last_paid_at).to eq(budget_item.last_executed_at)
      end
    end

    context 'when transaction is associated with an income' do
      let(:income_item) { create(:income, user: user, last_received_at: Date.yesterday) }
      let!(:transaction) do
        create(:transaction, :income,
          user: user,
          account: account,
          amount: 100,
          item: income_item
        )
      end

      before do
        # Simulate the balance after an income was created
        account.update!(balance: 1100)
      end

      it 'marks the income as pending' do
        expect(income_item.last_received_at).to be_present

        subject

        expect(income_item.reload.last_received_at).to eq(income_item.last_executed_at)
      end
    end
  end
end
