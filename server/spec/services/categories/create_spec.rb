require 'rails_helper'

RSpec.describe Categories::Create, type: :service do
  describe '#call' do
    let(:user) { create(:user) }
    let(:valid_params) do
      {
        name: 'Test Category',
        color: '#FF0000',
        icon: 'shopping'
      }
    end

    context 'with valid parameters' do
      it 'creates a new category' do
        expect {
          Categories::Create.call(user, valid_params)
        }.to change(Category, :count).by(1)
      end

      it 'returns success and the created category' do
        result = Categories::Create.call(user, valid_params)

        expect(result[:success]).to be true
        expect(result[:category]).to be_a(Category)
        expect(result[:category].name).to eq(valid_params[:name])
        expect(result[:category].color).to eq(valid_params[:color])
        expect(result[:category].icon).to eq(valid_params[:icon])
        expect(result[:category].user).to eq(user)
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { name: '' } }

      it 'does not create a new category' do
        expect {
          Categories::Create.call(user, invalid_params)
        }.not_to change(Category, :count)
      end

      it 'returns failure and error messages' do
        result = Categories::Create.call(user, invalid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
        expect(result[:errors]).to include("Name can't be blank")
      end
    end

    context 'when an exception occurs' do
      before do
        allow_any_instance_of(Category).to receive(:save!).and_raise(StandardError.new('Test error'))
      end

      it 'returns failure and the error message' do
        result = Categories::Create.call(user, valid_params)

        expect(result[:success]).to be false
        expect(result[:errors]).to eq('Test error')
      end
    end
  end
end 