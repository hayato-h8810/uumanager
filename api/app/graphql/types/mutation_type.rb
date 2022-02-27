# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_user, mutation: Mutations::CreateUser
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout
    field :delete_user, mutation: Mutations::DeleteUser
    field :save_url, mutation: Mutations::SaveUrl
  end
end
