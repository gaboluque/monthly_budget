require 'rails_helper'

RSpec.describe Transactions::FetchTypes do
  describe '.call' do
    it 'returns all transaction types' do
      result = described_class.call

      expect(result[:success]).to be true
      expect(result[:types]).to eq(Transaction::TRANSACTION_TYPES)
    end

    it 'handles exceptions gracefully' do
      service = described_class.new

      # Stub the private method to raise an error
      allow(service).to receive(:fetch_transaction_types).and_raise(StandardError.new('Test error'))

      # Call the method directly since we're working with an instance
      result = service.call

      expect(result[:success]).to be false
      expect(result[:errors]).to eq('Test error')
    end
  end
end
