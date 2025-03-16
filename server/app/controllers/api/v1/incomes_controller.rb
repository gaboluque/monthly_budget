module Api
  module V1
    class IncomesController < ApplicationController
      before_action :set_income, only: [ :show, :update, :destroy, :mark_as_received, :mark_as_pending ]

      # GET /api/v1/incomes
      def index
        @incomes = current_user.incomes
        render json: {
          data: @incomes
        }
      end

      # GET /api/v1/incomes/:id
      def show
        render json: @income
      end

      # POST /api/v1/incomes
      def create
        @income = current_user.incomes.build(income_params)

        if @income.save
          render json: @income, status: :created
        else
          render json: { errors: @income.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/incomes/:id
      def update
        if @income.update(income_params)
          render json: @income
        else
          render json: { errors: @income.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/incomes/:id
      def destroy
        @income.destroy
        render json: @income, status: :ok
      end

      # PUT /api/v1/incomes/:id/mark_as_received
      def mark_as_received
        if current_user.incomes.pending.where(id: params[:id]).blank?
          render json: { errors: 'Income is not pending' }, status: :unprocessable_entity
          return
        end

        ActiveRecord::Base.transaction do
          @income.update(last_received_at: Time.current)
          @income.account.update(balance: @income.account.balance + @income.amount)
          render json: @income, status: :ok
        end
      end

      # PUT /api/v1/incomes/:id/mark_as_pending
      def mark_as_pending
        if current_user.incomes.received_this_month.where(id: params[:id]).blank?
          render json: { errors: 'Income is not received' }, status: :unprocessable_entity
          return
        end

        ActiveRecord::Base.transaction do
          @income.update(last_received_at: nil)
          @income.account.update(balance: @income.account.balance - @income.amount)
          render json: @income, status: :ok
        end
      end

      # GET /api/v1/incomes/categories
      def categories
        render json: { data: Income::FREQUENCIES }
      end

      # GET /api/v1/incomes/pending
      def pending
        @pending_incomes = current_user.incomes.pending
        render json: {
          data: @pending_incomes
        }
      end

      # GET /api/v1/incomes/received
      def received
        @received_incomes = current_user.incomes.received
        render json: {
          data: @received_incomes
        }
      end

      private

      def set_income
        @income = current_user.incomes.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Income not found" }, status: :not_found
      end

      def income_params
        params.require(:income).permit(:name, :amount, :frequency, :account_id)
      end
    end
  end
end
