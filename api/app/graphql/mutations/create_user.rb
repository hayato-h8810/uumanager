# frozen_string_literal: true
require 'digest'

module Mutations
  class CreateUser < BaseMutation
    argument :confirmation_token, String, required: false

    type ObjectTypes::User

    def resolve(confirmation_token:)
      raise GraphQL::ExecutionError, 'INVALID_URL_ERROR' unless email = confirmation_token.match(/^\d+-(.+)$/).to_a[1]

      unless confirmation_sent_at_token = confirmation_token.match(/^(\d+)/).to_a[1]
        raise GraphQL::ExecutionError,
              'INVALID_URL_ERROR'
      end

      confirmation_sent_at = Time.zone.at(confirmation_sent_at_token.to_i)
      confirmation_sent_at_range = confirmation_sent_at..confirmation_sent_at + 1

      raise GraphQL::ExecutionError, 'INVALID_URL_ERROR' unless user = User.find_by(confirmation_email: Digest::SHA256.hexdigest(email),
                                                                                    confirmation_sent_at: confirmation_sent_at_range)
      raise GraphQL::ExecutionError, 'EMAIL_ERROR' if User.find_by(email: email)
      raise GraphQL::ExecutionError, 'TIMEOUT_ERROR' if (Time.zone.now - confirmation_sent_at).floor / 3600 >= 1

      user.update(email: email, confirmation_sent_at: nil, confirmation_email: nil)

      context[:session][:user_id] = user.id
      user
    end
  end
end
