module Api
  module V1
    class ExpensesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_expense, only: [ :show, :update, :destroy, :mark_as_expensed, :mark_as_pending ]

      # GET /api/v1/expenses
      def index
        @expenses = current_user.expenses.order(created_at: :desc)
      end

      # GET /api/v1/expenses/:id
      def show
      end

      # POST /api/v1/expenses
      def create
        result = Expenses::Create.call(current_user, expense_params)

        if result[:success]
          @expense = result[:expense]
          render :show, status: :created
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PUT /api/v1/expenses/:id
      def update
        result = Expenses::Update.call(@expense, expense_params)

        if result[:success]
          @expense = result[:expense]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # DELETE /api/v1/expenses/:id
      def destroy
        result = Expenses::Destroy.call(@expense)

        if result[:success]
          @expense = result[:expense]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/expenses/categories
      def categories
      end

      # GET /api/v1/expenses/pending
      def pending
        result = Expenses::FetchPending.call(current_user)

        if result[:success]
          @expenses = result[:expenses]
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/expenses/expensed
      def expensed
        result = Expenses::FetchExpensed.call(current_user)

        if result[:success]
          @expenses = result[:expenses]
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PUT /api/v1/expenses/:id/mark_as_expensed
      def mark_as_expensed
        result = Expenses::MarkAsExpensed.call(@expense)

        if result[:success]
          @expense = result[:expense]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PUT /api/v1/expenses/:id/mark_as_pending
      def mark_as_pending
        result = Expenses::MarkAsPending.call(@expense)

        if result[:success]
          @expense = result[:expense]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
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
