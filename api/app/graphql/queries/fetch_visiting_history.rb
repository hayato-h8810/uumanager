# frozen_string_literal: true

module Queries
  class FetchVisitingHistory < Queries::BaseQuery
    null true

    type [ObjectTypes::VisitingHistory], null: true

    def resolve
      user = context[:current_user]
      return if user.visitingHistorys.all.blank?

      user.visitingHistorys.all
    end
  end
end
