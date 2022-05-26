# frozen_string_literal: true

require 'securerandom'
require 'digest'

module Mutations
  class SendMailForEditEmail < BaseMutation
    argument :password, String, required: true
    argument :new_email, String, required: true

    type ObjectTypes::User

    def resolve(password:, new_email:)
      user = context[:current_user]

      raise GraphQL::ExecutionError, 'PASSWORD_ERROR' unless user.authenticate(password)

      user.update(edit_email_token: Digest::SHA256.hexdigest(new_email),
                  edit_email_sent_at: Time.zone.now)
      EditEmailMailer.send_mail_for_edit_email(user, new_email).deliver
      user
    end
  end
end
