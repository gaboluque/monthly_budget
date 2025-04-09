module Api
    module V1
      class AuthenticationController < ApplicationController
        skip_before_action :authenticate_user!

        def login
          @user = User.find_by(email: user_params[:email])

          puts "User: #{@user.inspect}"
          puts "User params: #{user_params.inspect}"
          puts "User authenticate: #{@user&.authenticate(user_params[:password])}"

          if @user&.authenticate(user_params[:password])
            @jwt = generate_jwt(@user)
          else
            render_error("Invalid credentials", :unauthorized)
          end
        end

        def signup
          @user = User.new(user_params)
          if @user.save
            @jwt = generate_jwt(@user)
          else
            render_error(@user.errors.full_messages, :unprocessable_entity)
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
