# frozen_string_literal: true

module Mutations
  class DeleteVisitingHistory < BaseMutation
    argument :id, String, required: true

    type [ObjectTypes::VisitingHistory]

    def resolve(id:)
      VisitingHistory.find(id)&.destroy
      context[:current_user].visitingHistorys.all
    end
  end
end
