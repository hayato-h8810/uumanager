# frozen_string_literal: true

module Mutations
  
  class DeleteUser < BaseMutation
    null true

    argument :password, String, required: true

    field :user, ObjectTypes::User, null: true

    def resolve(password:)

      user = User.find(context[:session][:user_id])

      raise GraphQL::ExecutionError, 'PASSWORD_ERROR' unless user.authenticate(password)
      user.destroy
      context[:session][:user_id] = nil if user 

      { user: user }
    end
  end

end
