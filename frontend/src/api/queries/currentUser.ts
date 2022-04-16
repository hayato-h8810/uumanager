import { gql } from '@apollo/client'

export default gql`
  query currentUser {
    currentUser {
      id
      name
      email
      createdAt
    }
  }
`
