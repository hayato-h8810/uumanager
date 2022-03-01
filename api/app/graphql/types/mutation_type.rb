# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_user, mutation: Mutations::CreateUser
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout
    field :delete_user, mutation: Mutations::DeleteUser
    field :save_url, mutation: Mutations::SaveUrl
    field :delete_url, mutation: Mutations::DeleteUrl
    field :edit_url, mutation: Mutations::EditUrl
    field :delete_folder, mutation: Mutations::DeleteFolder
    field :edit_folder, mutation: Mutations::EditFolder
  end
end
