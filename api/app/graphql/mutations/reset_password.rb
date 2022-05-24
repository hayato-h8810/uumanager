# frozen_string_literal: true

require 'securerandom'
require 'digest'

module Mutations
  class ResetPassword < BaseMutation
    argument :email, String, required: true
    argument :new_password, String, required: true
    argument :reset_password_token, String, required: true

    type ObjectTypes::User

    def resolve(email:, new_password:, reset_password_token:)
      raise GraphQL::ExecutionError, 'INVALID_TOKEN_ERROR' unless user = User.find_by(email: email,
                                                                                      reset_password_token: Digest::SHA256.hexdigest(reset_password_token))
      raise GraphQL::ExecutionError, 'TIMEOUT_ERROR' if (Time.zone.now - user.reset_password_sent_at).floor / 3600 >= 1

      user.update(password: new_password, reset_password_token: nil, reset_password_sent_at: nil)

      user
    end
  end
end
