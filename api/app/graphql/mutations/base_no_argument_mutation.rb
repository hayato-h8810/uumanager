# frozen_string_literal: true

module Mutations
  class BaseNoArgumentMutation < GraphQL::Schema::Mutation
    null false
  end
end
