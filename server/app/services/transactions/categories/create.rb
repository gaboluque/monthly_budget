module Transactions
  module Categories
    class Create < ApplicationService
      attr_reader :user, :params

      def initialize(user, params)
        @user = user
        @params = params
      end

      def call
        ActiveRecord::Base.transaction do
          category = Transaction::Category.create!(user: user, **params)

          { success: true, category: category }
        end
      rescue ActiveRecord::RecordInvalid => e
        { success: false, errors: e.record.errors.full_messages }
      rescue StandardError => e
        { success: false, errors: e.message }
      end
    end
  end
end
