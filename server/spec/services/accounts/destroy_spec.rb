require 'rails_helper'

RSpec.describe Accounts::Destroy, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let!(:account) { create(:account, user: user) }

    context 'when successful' do
      it 'destroys the account' do
        expect {
          Accounts::Destroy.call(account)
        }.to change(Account, :count).by(-1)
      end

      it 'returns success and the destroyed account' do
        result = Accounts::Destroy.call(account)

        expect(result[:success]).to be true
        expect(result[:account]).to eq(account)
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Account).to receive(:destroy).and_raise(StandardError.new('Test error'))
      end

      it 'does not destroy the account' do
        expect {
          Accounts::Destroy.call(account)
        }.not_to change(Account, :count)
      end

      it 'returns failure and the error message' do
        result = Accounts::Destroy.call(account)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
