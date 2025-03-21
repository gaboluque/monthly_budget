module Api
  module V1
    class IncomesController < ApplicationController
      before_action :set_income, only: [ :show, :update, :destroy, :mark_as_received, :mark_as_pending ]

      # GET /api/v1/incomes
      def index
        @incomes = current_user.incomes.order(created_at: :desc)
      end

      # GET /api/v1/incomes/:id
      def show; end

      # POST /api/v1/incomes
      def create
        result = Incomes::Create.call(current_user, income_params)

        if result[:success]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PATCH/PUT /api/v1/incomes/:id
      def update
        result = Incomes::Update.call(@income, income_params)

        if result[:success]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # DELETE /api/v1/incomes/:id
      def destroy
        result = Incomes::Destroy.call(@income)

        if result[:success]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PUT /api/v1/incomes/:id/mark_as_received
      def mark_as_received
        result = Incomes::MarkAsReceived.call(@income)

        if result[:success]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PUT /api/v1/incomes/:id/mark_as_pending
      def mark_as_pending
        result = Incomes::MarkAsPending.call(@income)

        if result[:success]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/incomes/categories
      def categories
        render json: { data: Income::CATEGORIES }
      end

      # GET /api/v1/incomes/pending
      def pending
        result = Incomes::FetchPending.call(current_user)

        if result[:success]
          render json: { data: result[:incomes] }
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/incomes/received
      def received
        result = Incomes::FetchReceived.call(current_user)

        if result[:success]
          render json: {
            data: result[:incomes]
          }
        else
          render_error(result[:errors], :unprocessable_entity)
        end
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
