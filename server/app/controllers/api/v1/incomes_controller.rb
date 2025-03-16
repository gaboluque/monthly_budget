module Api
  module V1
    class IncomesController < ApplicationController
      before_action :set_income, only: [ :show, :update, :destroy ]

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
