class User < ApplicationRecord
  require "securerandom"

  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }

  has_many :incomes, dependent: :destroy
  has_many :expenses, dependent: :destroy
  has_many :accounts, dependent: :destroy
end
