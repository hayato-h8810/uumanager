import { gql } from '@apollo/client'

export default gql`
  mutation recordBrowsingHistory($urlId: String!, $date: String!) {
    recordBrowsingHistory(input: { urlId: $urlId, date: $date }) {
      id
      urlId
      date
    }
  }
`
