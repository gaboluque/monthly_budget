require 'rails_helper'

RSpec.describe Incomes::MarkAsReceived, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:income) { create(:income, user: user, account: account, last_received_at: nil) }

    context 'when income exists and is pending' do
      before do
        allow(income).to receive(:paid?).and_return(false)
      end

      it 'marks the income as received' do
        expect(income.last_received_at).to be_nil

        result = Incomes::MarkAsReceived.call(income)
        income.reload

        expect(income.last_received_at).not_to be_nil
        expect(income.last_received_at).to be_within(1.minute).of(Time.current)
      end

      it 'returns success and the updated income' do
        result = Incomes::MarkAsReceived.call(income)

        expect(result[:success]).to be true
        expect(result[:income]).to eq(income)
        expect(result[:income].last_received_at).not_to be_nil
      end

      it 'creates a transaction record' do
        expect {
          result = Incomes::MarkAsReceived.call(income)
        }.to change(Transaction, :count).by(1)

        transaction = Transaction.last
        expect(transaction.user).to eq(user)
        expect(transaction.account).to eq(account)
        expect(transaction.amount).to eq(income.amount)
        expect(transaction.transaction_type).to eq('income')
        expect(transaction.description).to eq("Income: #{income.name}")
        expect(transaction.executed_at).to be_within(1.minute).of(Time.current)
      end

      it 'sets the income last_received_at to the transaction executed_at date' do
        result = Incomes::MarkAsReceived.call(income)
        income.reload
        transaction = Transaction.last

        expect(income.last_received_at).to eq(transaction.executed_at)
      end
    end

    context 'when income is already received in the current month' do
      let(:received_income) { create(:received_income, user: user, account: account) }

      before do
        allow(received_income).to receive(:paid?).and_return(true)
      end

      it 'does not update the received timestamp' do
        original_timestamp = received_income.last_received_at

        result = Incomes::MarkAsReceived.call(received_income)
        received_income.reload

        expect(result[:success]).to be true
        expect(result[:income]).to eq(received_income)
        expect(received_income.last_received_at).to eq(original_timestamp)
      end

      it 'does not create a transaction record' do
        expect {
          result = Incomes::MarkAsReceived.call(received_income)
        }.not_to change(Transaction, :count)
      end
    end

    context 'when using a specific date' do
      let(:specific_date) { 1.week.ago }

      before do
        allow(income).to receive(:paid?).and_return(false)
      end

      it 'creates a transaction with the specified date' do
        allow_any_instance_of(described_class).to receive(:create_transaction).and_wrap_original do |original_method, date|
          original_method.call(specific_date)
        end

        result = Incomes::MarkAsReceived.call(income)
        income.reload

        expect(income.last_received_at).to be_within(1.second).of(specific_date)
      end
    end

    context 'when an exception occurs' do
      before do
        allow(income).to receive(:paid?).and_return(false)
        allow(income).to receive(:update!).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Incomes::MarkAsReceived.call(income)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end

    context 'when transaction creation fails' do
      before do
        allow(income).to receive(:paid?).and_return(false)
        allow_any_instance_of(Transactions::Create).to receive(:call).and_return({
          success: false,
          errors: [ 'Transaction creation failed' ]
        })
      end

      it 'rolls back the changes and returns error' do
        expect {
          result = Incomes::MarkAsReceived.call(income)

          expect(result[:success]).to be false
          expect(result[:errors]).to include('Failed to create transaction')

          income.reload
          expect(income.last_received_at).to be_nil
        }.not_to change(Transaction, :count)
      end
    end
  end
end
