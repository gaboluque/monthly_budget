Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      post "login", to: "authentication#login"
      post "signup", to: "authentication#signup"

      resources :incomes do
        collection do
          get :categories
        end
      end
      resources :expenses do
        collection do
          get :categories
          get :pending
          get :expensed
        end
        member do
          post :mark_as_expensed
          post :unmark_as_expensed
        end
      end
      resources :accounts do
        collection do
          get :types
          get :currencies
        end
      end
      resources :insights, only: [ :index ]
    end
  end
end
