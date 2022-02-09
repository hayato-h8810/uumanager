# frozen_string_literal: true

module Mutations
  class CreateUser < BaseMutation
    # often we will need input types for specific mutation
    # in those cases we can define those input types in the mutation class itself
    class AuthProviderSignupData < Types::BaseInputObject
      argument :credentials, InputTypes::AuthProviderCredentialsInput, required: false
    end

    argument :name, String, required: true
    argument :auth_provider, AuthProviderSignupData, required: false

    type ObjectTypes::User

    def resolve(name: nil, auth_provider: nil)
      user = User.create!(
        name: name,
        email: auth_provider&.[](:credentials)&.[](:email),
        password: auth_provider&.[](:credentials)&.[](:password)
      )
      ConfirmationMailer.send_confirmation_mail(user).deliver
      user
    end
  end
end
