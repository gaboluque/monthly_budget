Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      post "login", to: "authentication#login"
      post "signup", to: "authentication#signup"

      resources :incomes
      resources :expenses do
        collection do
          get :categories
        end
      end
    end
  end
end
