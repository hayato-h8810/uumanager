# frozen_string_literal: true

class LoginHistory < ApplicationRecord
  belongs_to :user
end
