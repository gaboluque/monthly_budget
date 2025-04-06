require 'rails_helper'

RSpec.describe Account::Destroy, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let!(:account) { create(:account, :savings, :usd, :owned, user: user) }

    context 'when successful' do
      it 'destroys the account' do
        expect {
          Account::Destroy.call(account)
        }.to change(Account, :count).by(-1)
      end

      it 'returns success and the destroyed account' do
        result = Account::Destroy.call(account)

        expect(result[:success]).to be true
        expect(result[:account]).to eq(account)
      end

      it 'destroys associated transactions' do
        transactions = create_list(:transaction, 3, account: account)

        expect {
          Account::Destroy.call(account)
        }.to change(Transaction, :count).by(-3)
      end

      it 'destroys different types of accounts' do
        account_types = %w[checking credit_card loan investment other]

        account_types.each do |type|
          test_account = create(:account, account_type: type, user: user)

          expect {
            result = Account::Destroy.call(test_account)
            expect(result[:success]).to be true
          }.to change(Account, :count).by(-1)
        end
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Account).to receive(:destroy).and_raise(StandardError.new('Test error'))
      end

      it 'does not destroy the account' do
        expect {
          Account::Destroy.call(account)
        }.not_to change(Account, :count)
      end

      it 'returns failure and the error message' do
        result = Account::Destroy.call(account)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end

    context 'when dependent objects prevent destruction' do
      before do
        # Simulate foreign key constraint or validation that prevents destruction
        allow_any_instance_of(Account).to receive(:destroy).and_return(false)
        account.errors.add(:base, "Cannot delete account with active dependent records")
      end

      it 'does not destroy the account' do
        expect {
          Account::Destroy.call(account)
        }.not_to change(Account, :count)
      end

      it 'returns failure and error messages' do
        result = Account::Destroy.call(account)

        expect(result[:success]).to be false
        expect(result[:errors]).to include("Cannot delete account with active dependent records")
      end
    end
  end
end
