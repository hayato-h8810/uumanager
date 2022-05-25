# frozen_string_literal: true

module Mutations
  class EditUserName < BaseMutation
    argument :password, String, required: true
    argument :new_name, String, required: true

    type ObjectTypes::User

    def resolve(password:, new_name:)
      user = context[:current_user]

      raise GraphQL::ExecutionError, 'PASSWORD_ERROR' unless user.authenticate(password)

      user.update(name: new_name)

      user
    end
  end
end
