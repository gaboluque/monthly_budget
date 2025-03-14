module Api
  module V1
    class AccountsController < ApplicationController
      before_action :set_account, only: [ :show, :update, :destroy ]

      # GET /api/v1/accounts
      def index
        @accounts = current_user.accounts
        render json: {
          data: @accounts
        }
      end

      # GET /api/v1/accounts/:id
      def show
        render json: @account
      end

      # POST /api/v1/accounts
      def create
        @account = current_user.accounts.build(account_params)

        if @account.save
          render json: @account, status: :created
        else
          render json: { errors: @account.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/accounts/:id
      def update
        if @account.update(account_params)
          render json: @account
        else
          render json: { errors: @account.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/accounts/:id
      def destroy
        @account.destroy
        render json: @account, status: :ok
      end

      # GET /api/v1/accounts/types
      def types
        render json: { data: Account::ACCOUNT_TYPES }
      end

      # GET /api/v1/accounts/currencies
      def currencies
        render json: { data: Account::CURRENCIES }
      end

      private

      def set_account
        @account = current_user.accounts.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Account not found" }, status: :not_found
      end

      def account_params
        params.require(:account).permit(:name, :balance, :account_type, :currency, :description)
      end
    end
  end
end
