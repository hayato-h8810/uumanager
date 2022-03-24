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
    field :add_folder, mutation: Mutations::AddFolder
    field :record_visiting_history, mutation: Mutations::RecordVisitingHistory
    field :delete_visiting_history, mutation: Mutations::DeleteVisitingHistory
  end
end
