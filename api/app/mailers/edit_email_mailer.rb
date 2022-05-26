# frozen_string_literal: true

class EditEmailMailer < ApplicationMailer
  def send_mail_for_edit_email(user, new_email)
    @user = user
    @new_email = new_email
    mail to: new_email, subject: 'メールアドレス変更メール'
  end
end
