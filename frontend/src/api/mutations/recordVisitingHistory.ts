import { gql } from '@apollo/client'

export default gql`
  mutation recordVisitingHistory($urlId: String!, $date: String!) {
    recordVisitingHistory(input: { urlId: $urlId, date: $date }) {
      id
      urlId
      date
    }
  }
`
