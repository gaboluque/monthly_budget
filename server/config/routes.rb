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
          get :pending
          get :received
        end
        member do
          put :mark_as_received
          put :mark_as_pending
        end
      end
      resources :budget_items do
        collection do
          get :categories
          get :pending
          get :paid
        end
        member do
          put :mark_as_paid
          put :mark_as_pending
        end
      end
      resources :accounts do
        collection do
          get :types
          get :currencies
        end
      end
      resources :transactions, only: [ :index, :show, :destroy, :create ] do
        collection do
          get :types
          get :frequencies
          get :categories
        end
      end
      resources :insights, only: [ :index ] do
        collection do
          get :monthly_balance
        end
      end
    end
  end
end
