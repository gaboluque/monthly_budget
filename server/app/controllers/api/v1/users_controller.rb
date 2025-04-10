module Api
  module V1
    class UsersController < ApplicationController

      # GET /api/v1/users/me
      def me
        @user = current_user
        @jwt = generate_jwt(@user)
      end

      # POST /api/v1/users/onboarding
      def onboarding
        result = Users::Onboarding.call(current_user, onboarding_params)

        if result[:success]
          render json: { success: true }, status: :created
        else
          render_error(result[:errors], :unprocessable_entity)
        end
      end

      private

      def onboarding_params
        puts "PARAMS: #{params}"
        params.require(:onboarding).permit(:name, :savingsGoal, :budgetMethod,mainAccount: [:name, :type, :balance], income: [:name, :frequency, :amount], budgetDistribution: [:needs, :wants, :savings])
      end

      def generate_jwt(user)
        jwt = jwt_encode(user_id: user.id)
      end
    end
  end
end
