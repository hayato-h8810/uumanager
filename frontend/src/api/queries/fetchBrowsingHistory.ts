import { gql } from '@apollo/client'

export default gql`
  query fetchBrowsingHistory {
    fetchBrowsingHistory {
      id
      urlId
      date
    }
  }
`
