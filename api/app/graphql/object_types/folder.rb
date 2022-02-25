# frozen_string_literal: true

module ObjectTypes
  class Folder < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :urls, [ObjectTypes::Url], null: false
  end
end
