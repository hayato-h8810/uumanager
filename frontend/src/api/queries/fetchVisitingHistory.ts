import { gql } from '@apollo/client'

export default gql`
  query fetchVisitingHistory {
    fetchVisitingHistory {
      id
      urlId
      date
    }
  }
`
