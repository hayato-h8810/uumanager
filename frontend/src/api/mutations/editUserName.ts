import { gql } from '@apollo/client'

export default gql`
  mutation editUserName($password: String!, $newName: String!) {
    editUserName(input: { password: $password, newName: $newName }) {
      id
      name
      email
    }
  }
`
