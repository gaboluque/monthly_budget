class User < ApplicationRecord
  require "securerandom"

  has_secure_password

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 6 }

  has_many :incomes, dependent: :destroy
  has_many :expenses, dependent: :destroy
  has_many :accounts, dependent: :destroy
  has_many :transactions, dependent: :destroy

  before_validation :normalize_email

  private

  def normalize_email
    self.email = email.strip.downcase if email.present?
  end
end
