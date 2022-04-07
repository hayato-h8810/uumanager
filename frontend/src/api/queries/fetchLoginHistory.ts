import { gql } from '@apollo/client'

export default gql`
  query fetchLoginHistory {
    fetchLoginHistory {
      id
      date
    }
  }
`
