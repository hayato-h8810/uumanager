import { gql } from '@apollo/client'

export default gql`
  mutation deleteUser($password: String!) {
    deleteUser(input: { password: $password }) {
      user {
        id
        name
        email
      }
    }
  }
`
