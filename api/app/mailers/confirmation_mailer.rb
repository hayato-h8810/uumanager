# frozen_string_literal: true

class ConfirmationMailer < ApplicationMailer
  def send_confirmation_mail(user)
    @user = user
    mail to: @user.email, subject: 'title is here'
  end
end
