# frozen_string_literal: true

class ResetPasswordMailer < ApplicationMailer
  def send_reset_password_mail(user, reset_password_token)
    @user = user
    @reset_password_token = reset_password_token
    mail to: user.email, subject: 'パスワード変更メール'
  end
end
