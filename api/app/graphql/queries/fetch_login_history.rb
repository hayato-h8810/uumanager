# frozen_string_literal: true

module Queries
  class FetchLoginHistory < Queries::BaseQuery
    type [ObjectTypes::LoginHistory], null: false

    def resolve
      user = context[:current_user]
      user.loginHistories
    end
  end
end
