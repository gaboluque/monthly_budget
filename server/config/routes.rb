Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      post "login", to: "authentication#login"
      post "signup", to: "authentication#signup"

      resources :incomes
      resources :expenses do
        member do
          post :mark_as_expensed
        end
        collection do
          get :categories
          get :pending
        end
      end
    end
  end
end
