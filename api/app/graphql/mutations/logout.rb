# frozen_string_literal: true

module Mutations
  class Logout < BaseNoArgumentMutation
    null true
      field :id, String, null: true
    

    def resolve
      context[:session][:user_id] = nil
    end
  end
end
