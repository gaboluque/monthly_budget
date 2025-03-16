require 'rails_helper'

RSpec.describe Expenses::Update, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:expense) { create(:expense, user: user, account: account) }
    let(:valid_params) do
      {
        name: 'Updated Expense',
        amount: 200.00,
        frequency: 'weekly',
        category: 'Wants'
      }
    end

    context 'with valid parameters' do
      it 'updates the expense' do
        result = Expenses::Update.call(expense, valid_params)
        expense.reload

        expect(expense.name).to eq(valid_params[:name])
        expect(expense.amount).to eq(valid_params[:amount])
        expect(expense.frequency).to eq(valid_params[:frequency])
        expect(expense.category).to eq(valid_params[:category])
      end

      it 'returns success and the updated expense' do
        result = Expenses::Update.call(expense, valid_params)

        expect(result[:success]).to be true
        expect(result[:expense]).to eq(expense)
        expect(result[:expense].name).to eq(valid_params[:name])
        expect(result[:expense].amount).to eq(valid_params[:amount])
        expect(result[:expense].frequency).to eq(valid_params[:frequency])
        expect(result[:expense].category).to eq(valid_params[:category])
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { name: '', amount: -100 } }

      it 'does not update the expense' do
        original_name = expense.name
        original_amount = expense.amount

        Expenses::Update.call(expense, invalid_params)
        expense.reload

        expect(expense.name).to eq(original_name)
        expect(expense.amount).to eq(original_amount)
      end

      it 'returns failure and error messages' do
        result = Expenses::Update.call(expense, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Expense).to receive(:update).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Expenses::Update.call(expense, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
