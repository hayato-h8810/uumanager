# frozen_string_literal: true

module ObjectTypes
  class VisitingHistory < Types::BaseObject
    field :id, ID, null: false
    field :url_id, ID, null: false
    field :date, String, null: false
  end
end
