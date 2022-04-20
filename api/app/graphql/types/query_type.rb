# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :current_user, resolver: Queries::CurrentUser
    field :fetch_folder_and_url, resolver: Queries::FetchFolderAndUrl
    field :fetch_browsing_history, resolver: Queries::FetchBrowsingHistory
    field :fetch_login_history, resolver: Queries::FetchLoginHistory
  end
end
