import { gql } from '@apollo/client'

export default gql`
  mutation createUser($confirmationToken: String!) {
    createUser(input: { confirmationToken: $confirmationToken }) {
      id
      name
      email
    }
  }
`
