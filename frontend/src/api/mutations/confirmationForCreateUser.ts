import { gql } from '@apollo/client'

export default gql`
  mutation confirmationForCreateUser($credentials: AUTH_PROVIDER_CREDENTIALS!, $name: String!) {
    confirmationForCreateUser(input: { name: $name, authProvider: { credentials: $credentials } }) {
      id
      name
      email
    }
  }
`
