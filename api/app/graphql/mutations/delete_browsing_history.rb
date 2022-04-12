# frozen_string_literal: true

module Mutations
  class DeleteBrowsingHistory < BaseMutation
    argument :id, String, required: true

    type [ObjectTypes::BrowsingHistory]

    def resolve(id:)
      BrowsingHistory.find(id)&.destroy
      context[:current_user].browsingHistories.all
    end
  end
end
