# frozen_string_literal: true

module Mutations
  class Login < BaseMutation
    null true

    argument :credentials, InputTypes::AuthProviderCredentialsInput, required: false

    field :user, ObjectTypes::User, null: true

    def resolve(credentials: nil)
      return unless credentials

      user = User.find_by(email: credentials[:email])

      return unless user
      return unless user.authenticate(credentials[:password])

      context[:session][:user_id] = user.id

      { user: user }
    end
  end
end
