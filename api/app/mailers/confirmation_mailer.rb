# frozen_string_literal: true

class ConfirmationMailer < ApplicationMailer
  def send_confirmation_mail(user,email)
    @user = user
    @email = email
    mail to: email, subject: 'ユーザー新規作成認証メール'
  end
end
