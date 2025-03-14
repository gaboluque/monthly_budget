class Account < ApplicationRecord
  belongs_to :user

  # Validations
  validates :name, presence: true
  validates :balance, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :account_type, presence: true
  validates :currency, presence: true
  validates :is_owned, inclusion: { in: [ true, false ] }

  # Enums for account types
  ACCOUNT_TYPES = %w[Checking Savings Credit\ Card Loan Investment Other].freeze
  validates :account_type, inclusion: { in: ACCOUNT_TYPES }

  # Enums for currencies
  CURRENCIES = %w[COP USD EUR].freeze
  validates :currency, inclusion: { in: CURRENCIES }

  # Scopes
  scope :by_type, ->(type) { where(account_type: type) }
  scope :by_currency, ->(currency) { where(currency: currency) }
  scope :owned, -> { where(is_owned: true) }
  scope :not_owned, -> { where(is_owned: false) }
end
