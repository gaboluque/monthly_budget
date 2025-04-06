module Api
  module V1
    class TransactionsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_transaction, only: [ :show, :destroy ]

      # GET /api/v1/transactions
      def index
        @transactions = current_user.transactions.order(created_at: :desc)
      end

      # POST /api/v1/transactions
      def create
        result = Transaction::Create.call(current_user, transaction_params)
        @transaction = result[:transaction]

        if result[:success]
          render :show, status: :created
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/transactions/1
      def show
        result = Transaction::Formatter.call(@transaction)

        if result[:success]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # DELETE /api/v1/transactions/1
      def destroy
        result = Transaction::Destroy.call(@transaction)

        if result[:success]
          render :show, status: :no_content
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/transactions/types
      def types
        render json: { types: Transaction.transaction_types.keys }
      end

      # GET /api/v1/transactions/frequencies
      def frequencies
        render json: { frequencies: Transaction.frequencies.keys }
      end

      # GET /api/v1/transactions/categories
      def categories
        render json: { categories: BudgetItem::DEFAULT_CATEGORIES }
      end

      private

      def set_transaction
        @transaction = current_user.transactions.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Transaction not found' }, status: :not_found
      end

      def transaction_params
        params.require(:transaction).permit(
          :account_id,
          :recipient_account_id,
          :amount,
          :transaction_type,
          :description,
          :executed_at,
          :frequency,
          :category,
          :budget_item_id
        )
      end

      def render_error(errors, status)
        render json: { errors: errors }, status: status
      end
    end
  end
end
