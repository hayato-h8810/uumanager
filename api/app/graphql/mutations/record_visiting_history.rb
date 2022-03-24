# frozen_string_literal: true

module Mutations
  class RecordVisitingHistory < BaseMutation
    argument :url_id, String, required: true
    argument :date, String, required: true

    type ObjectTypes::VisitingHistory

    def resolve(url_id:, date:)
      Url.find_by(id: url_id)&.visitingHistorys&.create(date: date, user_id: context[:current_user].id)
    end
  end
end
