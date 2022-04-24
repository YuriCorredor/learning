Rails.application.routes.draw do
  devise_for :users
  resources :friends
  get 'about/index'
  root 'home#index'
end