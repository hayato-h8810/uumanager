# frozen_string_literal: true

module Mutations
  class RecordBrowsingHistory < BaseMutation
    argument :url_id, String, required: true
    argument :date, String, required: true

    type ObjectTypes::BrowsingHistory

    def resolve(url_id:, date:)
      Url.find_by(id: url_id)&.browsingHistories&.create(date: date, user_id: context[:current_user].id)
    end
  end
end
