module Api
  module V1
    class BudgetItemsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_budget_item, only: [ :show, :update, :destroy ]

      # GET /api/v1/budget_items
      def index
        @budget_items = current_user.budget_items.order(created_at: :desc)
                                   .includes(:transaction_categories)
      end

      # GET /api/v1/budget_items/:id
      def show
      end

      # POST /api/v1/budget_items
      def create
        result = BudgetItems::Create.call(current_user, budget_item_params)

        if result[:success]
          @budget_item = result[:budget_item]
          
          # Add transaction categories if provided
          add_transaction_categories(@budget_item)
          
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
          
          # Update transaction categories if provided
          update_transaction_categories(@budget_item)
          
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
        @categories = Transaction::Category.main.order(:id)
        render json: { data: @categories }
      end

      # GET /api/v1/budget_items/pending
      def pending
        @budget_items = current_user.budget_items.pending
                                   .includes(:transaction_categories)
        render :index
      end

      # GET /api/v1/budget_items/paid
      def paid
        @budget_items = current_user.budget_items.paid
                                   .includes(:transaction_categories)
        render :index
      end

      private

      def set_budget_item
        @budget_item = current_user.budget_items.includes(:transaction_categories).find(params[:id])
      end
      
      def add_transaction_categories(budget_item)
        if params[:budget_item][:transaction_category_ids].present?
          category_ids = params[:budget_item][:transaction_category_ids]
          category_ids = JSON.parse(category_ids) if category_ids.is_a?(String)
          
          category_ids.each do |category_id|
            category = Transaction::Category.find_by(id: category_id)
            budget_item.transaction_categories << category if category
          end
        end
      end
      
      def update_transaction_categories(budget_item)
        if params[:budget_item][:transaction_category_ids].present?
          # Clear existing categories
          budget_item.transaction_categories.clear
          
          # Add new categories
          add_transaction_categories(budget_item)
        end
      end

      def budget_item_params
        # Only permit basic budget item attributes, transaction categories are handled separately
        params.require(:budget_item).permit(
          :name, 
          :amount, 
          :frequency, 
          :last_paid_at
        )
      end
    end
  end
end
