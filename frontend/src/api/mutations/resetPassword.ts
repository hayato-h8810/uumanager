import { gql } from '@apollo/client'

export default gql`
  mutation resetPassword($email: String!, $newPassword: String!, $resetPasswordToken: String!) {
    resetPassword(input: { email: $email, newPassword: $newPassword, resetPasswordToken: $resetPasswordToken }) {
      id
      name
      email
    }
  }
`
