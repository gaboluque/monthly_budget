# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string           not null
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
    it { should validate_presence_of(:password) }
    it { should validate_length_of(:password).is_at_least(6) }

    context 'email format' do
      it 'is valid with a properly formatted email' do
        user = build(:user, email: 'valid.email@example.com')
        expect(user).to be_valid
      end

      it 'is invalid with an improperly formatted email' do
        user = build(:user, email: 'invalid-email')
        expect(user).not_to be_valid
      end

      it 'is case insensitive for email uniqueness' do
        create(:user, email: 'test@example.com')
        user = build(:user, email: 'TEST@example.com')
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include('has already been taken')
      end
    end
  end

  describe 'associations' do
    it { should have_many(:incomes).dependent(:destroy) }
    it { should have_many(:budget_items).dependent(:destroy) }
    it { should have_many(:accounts).dependent(:destroy) }

    it 'cascades deletion to associated records' do
      user = create(:user)
      create(:income, user: user)
      create(:budget_item, user: user)
      create(:account, user: user)

      expect { user.destroy }.to change { Income.count }.by(-1)
        .and change { BudgetItem.count }.by(-1)
        .and change { Account.count }.by(-1)
    end
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:user)).to be_valid
    end
  end

  describe 'user creation' do
    it 'creates a user with valid attributes' do
      user = User.new(
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      )
      expect(user).to be_valid
    end

    it 'is invalid without matching password confirmation' do
      user = User.new(
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'different_password'
      )
      expect(user).not_to be_valid
    end

    it 'is invalid with a password shorter than 6 characters' do
      user = build(:user, password: '12345', password_confirmation: '12345')
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include('is too short (minimum is 6 characters)')
    end

    it 'trims whitespace from email' do
      user = create(:user, email: ' test@example.com ')
      expect(user.email).to eq('test@example.com')
    end

    it 'downcases email before saving' do
      user = create(:user, email: 'TEST@EXAMPLE.COM')
      expect(user.email).to eq('test@example.com')
    end
  end

  describe 'authentication' do
    let(:user) { create(:user, password: 'password123') }

    it 'authenticates with correct password' do
      expect(user.authenticate('password123')).to eq(user)
    end

    it 'does not authenticate with incorrect password' do
      expect(user.authenticate('wrong_password')).to be_falsey
    end
  end

  describe 'secure password' do
    it 'hashes the password' do
      user = create(:user, password: 'password123')
      expect(user.password_digest).not_to eq('password123')
    end

    it 'changes password hash when password is updated' do
      user = create(:user, password: 'password123')
      original_digest = user.password_digest

      user.update!(password: 'newpassword123', password_confirmation: 'newpassword123')
      expect(user.password_digest).not_to eq(original_digest)
    end
  end
end
