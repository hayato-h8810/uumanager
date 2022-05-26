import { gql } from '@apollo/client'

export default gql`
  mutation editEmail($newEmail: String!, $id: String!) {
    editEmail(input: { newEmail: $newEmail, id: $id }) {
      id
      name
      email
    }
  }
`
