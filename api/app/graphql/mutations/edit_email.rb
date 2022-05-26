# frozen_string_literal: true

require 'digest'

module Mutations
  class EditEmail < BaseMutation
    argument :new_email, String, required: true
    argument :id, String, required: true

    type ObjectTypes::User

    def resolve(new_email:, id:)
      raise GraphQL::ExecutionError, 'INVALID_TOKEN_ERROR' unless user = User.find_by(id: id,
                                                                                      edit_email_token: Digest::SHA256.hexdigest(new_email))
      raise GraphQL::ExecutionError, 'TIMEOUT_ERROR' if (Time.zone.now - user.edit_email_sent_at).floor / 3600 >= 1

      user.update(email: new_email, edit_email_token: nil, edit_email_sent_at: nil)

      user
    end
  end
end
