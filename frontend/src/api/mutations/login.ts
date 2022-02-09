import { gql } from '@apollo/client'

export default gql`
  mutation login($credentials: AUTH_PROVIDER_CREDENTIALS!) {
    login(input: { credentials: $credentials }) {
      user {
        id
        name
        email
      }
    }
  }
`
