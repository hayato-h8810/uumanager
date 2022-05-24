import { gql } from '@apollo/client'

export default gql`
  mutation sendResetPasswordMail($email: String!) {
    sendResetPasswordMail(input: { email: $email }) {
      id
      name
      email
    }
  }
`
