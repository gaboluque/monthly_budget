# == Schema Information
#
# Table name: accounts
#
#  id           :bigint           not null, primary key
#  account_type :string           not null
#  balance      :decimal(15, 2)   not null
#  currency     :string           default("COP"), not null
#  description  :text
#  is_owned     :boolean          default(TRUE), not null
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_accounts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Account < ApplicationRecord
  belongs_to :user

  has_many :transactions, dependent: :destroy
  has_many :incoming_transactions, class_name: 'Transaction', foreign_key: 'recipient_account_id', dependent: :destroy

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
