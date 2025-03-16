require 'rails_helper'

RSpec.describe Expenses::Destroy, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let!(:expense) { create(:expense, user: user, account: account) }

    context 'when expense exists' do
      it 'destroys the expense' do
        expect {
          Expenses::Destroy.call(expense)
        }.to change(Expense, :count).by(-1)
      end

      it 'returns success' do
        result = Expenses::Destroy.call(expense)

        expect(result[:success]).to be true
      end
    end

    context 'when an exception occurs' do
      before do
        allow(expense).to receive(:destroy).and_raise(StandardError.new('Test error'))
      end

      it 'does not destroy the expense' do
        expect {
          Expenses::Destroy.call(expense)
        }.not_to change(Expense, :count)
      end

      it 'returns failure and the error message' do
        result = Expenses::Destroy.call(expense)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
