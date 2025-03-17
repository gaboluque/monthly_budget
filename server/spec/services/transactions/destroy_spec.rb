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

    context 'when the transaction cannot be destroyed' do
      before do
        allow(transaction).to receive(:destroy).and_return(false)
        allow(transaction).to receive(:errors).and_return(
          double(full_messages: [ 'Cannot delete this transaction' ])
        )
      end

      it 'returns errors' do
        result = described_class.call(transaction)

        expect(result[:success]).to be false
        expect(result[:errors]).to include('Cannot delete this transaction')
      end

      it 'does not delete the transaction' do
        expect {
          described_class.call(transaction)
        }.not_to change(Transaction, :count)
      end
    end
  end
end
