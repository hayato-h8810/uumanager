# frozen_string_literal: true

module ObjectTypes
  class Url < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :memo, String, null: true
    field :notification, String, null: true
    field :url, String, null: false
    field :folder_id, ID, null: false
    field :importance, Integer, null: false
  end
end
