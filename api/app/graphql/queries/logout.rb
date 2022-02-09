# frozen_string_literal: true

module Queries
  class Logout < BaseQuery

    class Id < Types::BaseObject
      field :id, String, null: true
    end

    type Id, null: true

    def resolve

      context[:session][:user_id].clear

    end
  end
end
