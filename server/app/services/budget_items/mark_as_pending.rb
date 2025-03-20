module BudgetItems
  class MarkAsPending < ApplicationService
    attr_reader :budget_item, :transaction

    def initialize(budget_item)
      @budget_item = budget_item
      @transaction = budget_item.current_month_transaction
    end

    def call
      Transactions::Destroy.call(transaction)
    end
  end
end
