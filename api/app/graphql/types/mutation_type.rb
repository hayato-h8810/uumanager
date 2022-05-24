# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :confirmation_for_create_user, mutation: Mutations::ConfirmationForCreateUser
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
    field :record_browsing_history, mutation: Mutations::RecordBrowsingHistory
    field :delete_browsing_history, mutation: Mutations::DeleteBrowsingHistory
    field :add_login_history, mutation: Mutations::AddLoginHistory
    field :transfer_multiple_urls, mutation: Mutations::TransferMultipleUrls
    field :send_reset_password_mail, mutation: Mutations::SendResetPasswordMail
    field :reset_password, mutation: Mutations::ResetPassword
  end
end
