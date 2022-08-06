# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: email_address_with_name('myapp8477@gmail.com', 'UUManager')
end
