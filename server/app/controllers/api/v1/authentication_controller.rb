module Api
  module V1
    class AuthenticationController < ApplicationController
      skip_before_action :authenticate_user!

      def login
        user = User.find_by(email: user_params[:email])

        if user&.authenticate(user_params[:password])
          render json: { jwt: generate_jwt(user) }, status: :ok
        else
          render json: { error: "Invalid credentials" }, status: :unauthorized
        end
      end

      def signup
        @user = User.new(user_params)
        if @user.save
          render json: { jwt: generate_jwt(@user) }, status: :created
        else
          render json: { error: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(:email, :password)
      end

      def generate_jwt(user)
        jwt = jwt_encode(user_id: user.id)
      end
    end
  end
end
