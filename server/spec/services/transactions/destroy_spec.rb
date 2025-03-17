require 'rails_helper'

RSpec.describe Transactions::Destroy do
  let(:user) { create(:user) }
  let(:account) { create(:account, user: user) }
  let!(:transaction) { create(:transaction, user: user, account: account) }

  describe '.call' do
    it 'destroys the transaction' do
      expect {
        result = described_class.call(transaction)
        expect(result[:success]).to be true
      }.to change(Transaction, :count).by(-1)
    end

    it 'returns the destroyed transaction' do
      result = described_class.call(transaction)

      expect(result[:transaction]).to eq(transaction)
    end

    context 'when the transaction is an income transaction' do
      let(:income) { create(:income, user: user, account: account, last_received_at: 1.day.ago) }
      let!(:transaction) { create(:transaction, :income, user: user, account: account, item: income) }

      it 'calls the Incomes::MarkAsPending service' do
        expect(Incomes::MarkAsPending).to receive(:call).with(income, transaction)
        described_class.call(transaction)
      end

      it 'marks the income as pending' do
        expect {
          described_class.call(transaction)
        }.to change { income.reload.last_received_at }.to(nil)
      end
    end

    context 'when the transaction is an expense transaction' do
      let(:expense) { create(:expense, user: user, account: account, last_expensed_at: 1.day.ago) }
      let!(:transaction) { create(:transaction, :expense, user: user, account: account, item: expense) }

      it 'calls the Expenses::MarkAsPending service' do
        expect(Expenses::MarkAsPending).to receive(:call).with(expense, transaction)
        described_class.call(transaction)
      end

      it 'marks the expense as pending' do
        expect {
          described_class.call(transaction)
        }.to change { expense.reload.last_expensed_at }.to(nil)
      end
    end

    context 'when the transaction type is neither income nor expense' do
      let!(:deposit_transaction) { create(:transaction, :deposit, user: user, account: account) }
      let!(:withdrawal_transaction) { create(:transaction, :withdrawal, user: user, account: account) }
      let!(:transfer_transaction) { create(:transaction, :transfer, user: user, account: account) }

      it 'only destroys the deposit transaction without calling MarkAsPending' do
        expect(Incomes::MarkAsPending).not_to receive(:call)
        expect(Expenses::MarkAsPending).not_to receive(:call)

        expect {
          described_class.call(deposit_transaction)
        }.to change(Transaction, :count).by(-1)
      end

      it 'only destroys the withdrawal transaction without calling MarkAsPending' do
        expect(Incomes::MarkAsPending).not_to receive(:call)
        expect(Expenses::MarkAsPending).not_to receive(:call)

        expect {
          described_class.call(withdrawal_transaction)
        }.to change(Transaction, :count).by(-1)
      end

      it 'only destroys the transfer transaction without calling MarkAsPending' do
        expect(Incomes::MarkAsPending).not_to receive(:call)
        expect(Expenses::MarkAsPending).not_to receive(:call)

        expect {
          described_class.call(transfer_transaction)
        }.to change(Transaction, :count).by(-1)
      end
    end

    context 'when an error occurs during rollback' do
      let(:income) { create(:income, user: user, account: account, last_received_at: 1.day.ago) }
      let!(:transaction) { create(:transaction, :income, user: user, account: account, item: income) }

      before do
        allow(Incomes::MarkAsPending).to receive(:call).and_raise(StandardError.new('Error during rollback'))
      end

      it 'rolls back the whole transaction' do
        result = described_class.call(transaction)

        expect(result[:success]).to be false
        expect(result[:errors]).to include('Error during rollback')
      end
    end
  end
end
