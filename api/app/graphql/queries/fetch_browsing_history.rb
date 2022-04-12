# frozen_string_literal: true

module Queries
  class FetchBrowsingHistory < Queries::BaseQuery
    null true

    type [ObjectTypes::BrowsingHistory], null: true

    def resolve
      user = context[:current_user]
      return if user.browsingHistories.all.blank?

      user.browsingHistories.all
    end
  end
end
