module Api
  module V1
    class BudgetsController < ApplicationController
      before_action :set_budget, only: [ :show, :update, :destroy ]

      # GET /api/v1/budgets
      def index
        @budgets = current_user.budgets.order(created_at: :desc)
      end

      # GET /api/v1/budgets/:id
      def show
      end

      # POST /api/v1/budgets
      def create
        result = Budgets::Create.call(current_user, budget_params)

        if result[:success]
          @budget = result[:budget]
          
          render :show, status: :created
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PUT /api/v1/budgets/:id
      def update
        result = Budgets::Update.call(@budget, budget_params)

        if result[:success]
          @budget = result[:budget]
          
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # DELETE /api/v1/budgets/:id
      def destroy
        result = Budgets::Destroy.call(@budget)

        if result[:success]
          @budget = result[:budget]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/budgets/pending
      def pending
        @budgets = current_user.budgets.pending
        render :index
      end

      # GET /api/v1/budgets/paid
      def paid
        @budgets = current_user.budgets.paid
        render :index
      end

      private

      def set_budget
        @budget = current_user.budgets.find(params[:id])
      end

      def budget_params
        params.require(:budget).permit(
          :name, 
          :amount, 
          :frequency, 
          :last_paid_at
        )
      end
    end
  end
end
