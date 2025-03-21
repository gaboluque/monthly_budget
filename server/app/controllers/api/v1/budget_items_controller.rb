module Api
  module V1
    class BudgetItemsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_budget_item, only: [ :show, :update, :destroy, :mark_as_paid, :mark_as_pending ]

      # GET /api/v1/budget_items
      def index
        @budget_items = current_user.budget_items.order(created_at: :desc, category: :asc)
      end

      # GET /api/v1/budget_items/:id
      def show
      end

      # POST /api/v1/budget_items
      def create
        result = BudgetItems::Create.call(current_user, budget_item_params)

        if result[:success]
          @budget_item = result[:budget_item]
          render :show, status: :created
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PUT /api/v1/budget_items/:id
      def update
        result = BudgetItems::Update.call(@budget_item, budget_item_params)

        if result[:success]
          @budget_item = result[:budget_item]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # DELETE /api/v1/budget_items/:id
      def destroy
        result = BudgetItems::Destroy.call(@budget_item)

        if result[:success]
          @budget_item = result[:budget_item]
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # GET /api/v1/budget_items/categories
      def categories
      end

      # GET /api/v1/budget_items/pending
      def pending
        @budget_items = current_user.budget_items.pending
        render :index
      end

      # GET /api/v1/budget_items/paid
      def paid
        @budget_items = current_user.budget_items.paid
        render :index
      end

      # PUT /api/v1/budget_items/:id/mark_as_paid
      def mark_as_paid
        result = BudgetItems::MarkAsPaid.call(@budget_item)

        if result[:success]
          @budget_item.reload
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      # PUT /api/v1/budget_items/:id/mark_as_pending
      def mark_as_pending
        result = BudgetItems::MarkAsPending.call(@budget_item)

        if result[:success]
          @budget_item.reload
          render :show
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      private

      def set_budget_item
        @budget_item = current_user.budget_items.find(params[:id])
      end

      def budget_item_params
        # Handle both old destination and new account_id
        params_hash = params.require(:budget_item).permit(:name, :amount, :category, :destination, :account_id, :frequency, :last_paid_at)

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
