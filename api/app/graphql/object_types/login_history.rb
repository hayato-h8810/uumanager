# frozen_string_literal: true

module ObjectTypes
  class LoginHistory < Types::BaseObject
    field :id, ID, null: false
    field :date, String, null: false
  end
end
