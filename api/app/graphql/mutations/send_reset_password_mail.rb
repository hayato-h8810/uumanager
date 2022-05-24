# frozen_string_literal: true

require 'securerandom'
require 'digest'

module Mutations
  class SendResetPasswordMail < BaseMutation
    argument :email, String, required: true

    type ObjectTypes::User

    def resolve(email:)
      reset_password_token = SecureRandom.alphanumeric

      raise GraphQL::ExecutionError, 'EMAIL_ERROR' unless user = User.find_by(email: email)

      user.update(reset_password_token: Digest::SHA256.hexdigest(reset_password_token),
                  reset_password_sent_at: Time.zone.now)
      ResetPasswordMailer.send_reset_password_mail(user, reset_password_token).deliver
      user
    end
  end
end
