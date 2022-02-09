# frozen_string_literal: true

module Queries
  class CurrentUser < Queries::BaseQuery
    type ObjectTypes::User, null: true

    def resolve
      context[:current_user]
    end
  end
end
