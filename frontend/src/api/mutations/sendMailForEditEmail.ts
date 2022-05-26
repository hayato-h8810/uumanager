import { gql } from '@apollo/client'

export default gql`
  mutation sendMailForEditEmail($newEmail: String!, $password: String!) {
    sendMailForEditEmail(input: { newEmail: $newEmail, password: $password }) {
      id
      name
      email
    }
  }
`
