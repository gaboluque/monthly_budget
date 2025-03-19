require 'rails_helper'

RSpec.describe Transactions::FetchTypes do
  describe '.call' do
    it 'returns all transaction types' do
      result = described_class.call

      expect(result[:success]).to be true
      expect(result[:types]).to eq(Transaction.transaction_types.keys)
    end

    it 'handles exceptions gracefully' do
      allow(Transaction).to receive(:transaction_types).and_raise(StandardError.new('Test error'))

      result = described_class.call

      expect(result[:success]).to be false
      expect(result[:errors]).to eq('Test error')
    end
  end
end
