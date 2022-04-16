# frozen_string_literal: true

module ObjectTypes
  class User < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :email, String, null: false
    field :created_at, Integer, null: false
  end
end
