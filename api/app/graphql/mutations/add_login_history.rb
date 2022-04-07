# frozen_string_literal: true

module Mutations
  class AddLoginHistory < BaseMutation
    argument :date, String, required: true

    type [ObjectTypes::LoginHistory]

    def resolve(date:)
      user = context[:current_user]
      user.loginHistories.create(date: date) if user.loginHistories.filter { |data| data[:date] == date }.blank?
      user.loginHistories
    end
  end
end
