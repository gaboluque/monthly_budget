module Api
  module V1
    class ApplicationController < ::ApplicationController
      before_action :authenticate_user!

      private

      def authenticate_user!
        header = request.headers["Authorization"]
        header = header.split(" ").last if header

        begin
          @decoded = jwt_decode(header)
          @current_user = User.find(@decoded[:user_id])
        rescue ActiveRecord::RecordNotFound => e
          render_error(e.message, :unauthorized)
        rescue JWT::DecodeError => e
          render_error(e.message, :unauthorized)
        end
      end

      def current_user
        @current_user
      end
    end
  end
end
