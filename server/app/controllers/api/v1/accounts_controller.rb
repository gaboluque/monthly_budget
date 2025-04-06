module Api
  module V1
    class AccountsController < ApplicationController
      before_action :set_account, only: [ :show, :update, :destroy ]

      # GET /api/v1/accounts
      def index
        @accounts = current_user.accounts.order(created_at: :desc)
      end

      # GET /api/v1/accounts/:id
      def show; end

      # POST /api/v1/accounts
      def create
        result = Account::Create.call(current_user, account_params)

        if result[:success]
          @account = result[:account]
          render :show, status: :created
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PATCH/PUT /api/v1/accounts/:id
      def update
        result = Account::Update.call(@account, account_params)

        if result[:success]
          @account = result[:account]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # DELETE /api/v1/accounts/:id
      def destroy
        result = Account::Destroy.call(@account)

        if result[:success]
          @account = result[:account]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/accounts/types
      def types; end

      # GET /api/v1/accounts/currencies
      def currencies; end

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
