require 'rails_helper'

RSpec.describe Income::Update, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:account) { create(:account, user: user) }
    let(:income) { create(:income, user: user, account: account) }
    let(:new_account) { create(:account, user: user) }

    let(:valid_params) do
      {
        name: 'Updated Income',
        amount: 1500.00,
        frequency: 'bi-weekly',
        account_id: new_account.id
      }
    end

    context 'with valid parameters' do
      it 'updates the income' do
        result = Income::Update.call(income, valid_params)
        income.reload

        expect(income.name).to eq(valid_params[:name])
        expect(income.amount).to eq(valid_params[:amount])
        expect(income.frequency).to eq(valid_params[:frequency])
        expect(income.account_id).to eq(valid_params[:account_id])
      end

      it 'returns success and the updated income' do
        result = Income::Update.call(income, valid_params)

        expect(result[:success]).to be true
        expect(result[:income]).to eq(income)
        expect(result[:income].name).to eq(valid_params[:name])
        expect(result[:income].amount).to eq(valid_params[:amount])
        expect(result[:income].frequency).to eq(valid_params[:frequency])
        expect(result[:income].account_id).to eq(valid_params[:account_id])
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { name: '', amount: -100 } }

      it 'does not update the income' do
        original_name = income.name
        original_amount = income.amount

        Income::Update.call(income, invalid_params)
        income.reload

        expect(income.name).to eq(original_name)
        expect(income.amount).to eq(original_amount)
      end

      it 'returns failure and error messages' do
        result = Income::Update.call(income, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Income).to receive(:update).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Income::Update.call(income, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end
