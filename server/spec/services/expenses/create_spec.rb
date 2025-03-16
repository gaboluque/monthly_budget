require 'rails_helper'

RSpec.describe Expenses::Create, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:valid_params) do
      {
        name: 'Test Expense',
        amount: 100.00,
        frequency: 'monthly',
        category: 'Needs',
        account_id: account.id
      }
    end

    context 'with valid parameters' do
      it 'creates a new expense' do
        expect {
          Expenses::Create.call(user, valid_params)
        }.to change(Expense, :count).by(1)
      end

      it 'returns success and the created expense' do
        result = Expenses::Create.call(user, valid_params)

        expect(result[:success]).to be true
        expect(result[:expense]).to be_a(Expense)
        expect(result[:expense].name).to eq(valid_params[:name])
        expect(result[:expense].amount).to eq(valid_params[:amount])
        expect(result[:expense].frequency).to eq(valid_params[:frequency])
        expect(result[:expense].category).to eq(valid_params[:category])
        expect(result[:expense].account_id).to eq(valid_params[:account_id])
        expect(result[:expense].user).to eq(user)
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { name: '', amount: -100 } }

      it 'does not create a new expense' do
        expect {
          Expenses::Create.call(user, invalid_params)
        }.not_to change(Expense, :count)
      end

      it 'returns failure and error messages' do
        result = Expenses::Create.call(user, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Expense).to receive(:save).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Expenses::Create.call(user, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
