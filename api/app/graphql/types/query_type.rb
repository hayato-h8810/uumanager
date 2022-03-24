# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :current_user, resolver: Queries::CurrentUser
    field :fetch_folder_url, resolver: Queries::FetchFolderUrl
    field :fetch_visiting_history, resolver: Queries::FetchVisitingHistory
  end
end
