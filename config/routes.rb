Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      post 'signin', to: 'users#signin'
      post 'signup', to: 'users#signup'
      get 'validate', to: 'users#validate'

      patch 'updateSettings', to: 'user_settings#update'
      
      post 'addToHistory', to: 'user_places#add'
    end
  end

  match '*path', to: 'pages#index', via: :all
end
