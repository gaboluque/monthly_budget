require 'rails_helper'

RSpec.describe Incomes::Destroy, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let!(:income) { create(:income, user: user, account: account) }

    context 'when income exists' do
      it 'destroys the income' do
        expect {
          Incomes::Destroy.call(income)
        }.to change(Income, :count).by(-1)
      end

      it 'returns success' do
        result = Incomes::Destroy.call(income)

        expect(result[:success]).to be true
      end
    end

    context 'when an exception occurs' do
      before do
        allow(income).to receive(:destroy).and_raise(StandardError.new('Test error'))
      end

      it 'does not destroy the income' do
        expect {
          Incomes::Destroy.call(income)
        }.not_to change(Income, :count)
      end

      it 'returns failure and the error message' do
        result = Incomes::Destroy.call(income)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
