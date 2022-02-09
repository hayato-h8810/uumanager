# frozen_string_literal: true

module InputTypes
  class AuthProviderCredentialsInput < Types::BaseInputObject
    graphql_name 'AUTH_PROVIDER_CREDENTIALS'

    argument :email, String, required: true
    argument :password, String, required: true
  end
end
