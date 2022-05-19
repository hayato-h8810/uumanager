# frozen_string_literal: true

class ConfirmationMailer < ApplicationMailer
  def send_confirmation_mail(user)
    @user = user
    mail to: @user.confirmation_email, subject: 'ユーザー新規作成認証メール'
  end
end
