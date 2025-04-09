module Api
  module V1
    class CategoriesController < ApplicationController

      # GET /api/v1/categories
      def index
        @categories = Category.root
      end
    end
  end
end
