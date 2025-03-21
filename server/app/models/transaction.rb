# == Schema Information
#
# Table name: transactions
#
#  id                   :bigint           not null, primary key
#  amount               :decimal(10, 2)   not null
#  category             :string
#  description          :text
#  executed_at          :datetime         not null
#  frequency            :string           default("one_time")
#  item_type            :string
#  transaction_type     :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  account_id           :bigint           not null
#  item_id              :bigint
#  recipient_account_id :bigint
#  user_id              :bigint           not null
#
# Indexes
#
#  index_transactions_on_account_id            (account_id)
#  index_transactions_on_category              (category)
#  index_transactions_on_frequency             (frequency)
#  index_transactions_on_item                  (item_type,item_id)
#  index_transactions_on_recipient_account_id  (recipient_account_id)
#  index_transactions_on_transaction_type      (transaction_type)
#  index_transactions_on_user_id               (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (recipient_account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :account
  belongs_to :recipient_account, class_name: 'Account', optional: true
  belongs_to :item, polymorphic: true, optional: true

  validates :amount, presence: true, numericality: true
  validates :transaction_type, presence: true
  validates :executed_at, presence: true

  enum :category, {
    needs: 'needs',
    wants: 'wants',
    savings: 'savings',
    debt: 'debt',
    investment: 'investment',
    income: 'income',
    other: 'other'
  }, default: :other, prefix: true

  enum :transaction_type, {
    transfer: 'transfer',
    income: 'income',
    expense: 'expense'
  }

  enum :frequency, {
    one_time: 'one_time'
  }, default: :one_time

  scope :by_type, ->(type) { where(transaction_type: type) }
  scope :transfers, -> { where(transaction_type: :transfer) }
  scope :incomes, -> { where(transaction_type: :income) }
  scope :expenses, -> { where(transaction_type: :expense) }
  scope :by_date_range, ->(start_date, end_date) { where(executed_at: start_date..end_date) }
  scope :by_frequency, ->(frequency) { where(frequency: frequency) }
  scope :recurring, -> { where.not(frequency: :one_time) }
  scope :by_category, ->(category) { where(category: category) }

  validate :validate_transfer_recipient

  private

  def validate_transfer_recipient
    if transfer? && recipient_account.nil?
      errors.add(:recipient_account, "must be present for transfer transactions")
    end
  end
end
