# frozen_string_literal: true

module Mutations
  class Login < BaseMutation
    null true

    argument :credentials, InputTypes::AuthProviderCredentialsInput, required: false

    field :user, ObjectTypes::User, null: true

    def resolve(credentials: nil)
      raise GraphQL::ExecutionError, 'SESSION_ERROR' unless context[:session][:user_id].blank?
      return unless credentials

      user = User.find_by(email: credentials[:email])

      raise GraphQL::ExecutionError, 'EMAIL_ERROR' unless user
      raise GraphQL::ExecutionError, 'PASSWORD_ERROR' unless user.authenticate(credentials[:password])

      context[:session][:user_id] = user.id

      { user: user }
    end
  end
end
