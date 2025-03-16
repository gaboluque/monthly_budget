module Api
  module V1
    class AccountsController < ApplicationController
      before_action :set_account, only: [ :show, :update, :destroy ]

      # GET /api/v1/accounts
      def index
        result = Accounts::Filter.call(current_user, params)

        if result[:success]
          render json: {
            data: result[:accounts]
          }
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/accounts/:id
      def show
        render json: @account
      end

      # POST /api/v1/accounts
      def create
        result = Accounts::Create.call(current_user, account_params)

        if result[:success]
          render json: result[:account], status: :created
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PATCH/PUT /api/v1/accounts/:id
      def update
        result = Accounts::Update.call(@account, account_params)

        if result[:success]
          render json: result[:account]
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # DELETE /api/v1/accounts/:id
      def destroy
        result = Accounts::Destroy.call(@account)

        if result[:success]
          render json: result[:account], status: :ok
        else
          render_error(result[:errors], :unprocessable_entity)
        end
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
        params.require(:account).permit(:name, :balance, :account_type, :currency, :description, :is_owned)
      end
    end
  end
end
