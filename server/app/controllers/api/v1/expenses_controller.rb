module Api
  module V1
    class ExpensesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_expense, only: [ :show, :update, :destroy, :mark_as_expensed, :unmark_as_expensed ]

      def index
        @expenses = current_user.expenses
        @expenses = @expenses.by_category(params[:category]) if params[:category].present?
        @expenses = @expenses.by_frequency(params[:frequency]) if params[:frequency].present?
        @expenses = @expenses.by_account(params[:account_id]) if params[:account_id].present?

        render json: {
          data: @expenses
        }
      end

      def show
        render json: @expense
      end

      def create
        @expense = current_user.expenses.build(expense_params)

        if @expense.save
          render json: @expense, status: :created
        else
          render json: { errors: @expense.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @expense.update(expense_params)
          render json: @expense
        else
          render json: { errors: @expense.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @expense.destroy
        render json: @expense, status: :ok
      end

      def categories
        render json: { data: Expense::DEFAULT_CATEGORIES }
      end

      def pending
        @pending_expenses = current_user.expenses.pending
        render json: {
          data: @pending_expenses
        }
      end

      def expensed
        current_month_start = Time.current.beginning_of_month
        current_month_end = Time.current.end_of_month
        @expensed_expenses = current_user.expenses.where(
          'last_expensed_at BETWEEN ? AND ?',
          current_month_start,
          current_month_end
        )
        render json: {
          data: @expensed_expenses
        }
      end

      def mark_as_expensed
        if @expense.update(last_expensed_at: Time.current)
          render json: @expense
        else
          render json: { errors: @expense.errors }, status: :unprocessable_entity
        end
      end

      def unmark_as_expensed
        if @expense.update(last_expensed_at: nil)
          render json: @expense
        else
          render json: { errors: @expense.errors }, status: :unprocessable_entity
        end
      end

      private

      def set_expense
        @expense = current_user.expenses.find(params[:id])
      end

      def expense_params
        # Handle both old destination and new account_id
        params_hash = params.require(:expense).permit(:name, :amount, :category, :destination, :account_id, :frequency, :last_expensed_at)

        # If destination is provided but account_id is not, try to use destination as account_id
        if params_hash[:destination].present? && params_hash[:account_id].blank?
          params_hash[:account_id] = params_hash[:destination]
          params_hash.delete(:destination)
        end

        params_hash
      end
    end
  end
end
