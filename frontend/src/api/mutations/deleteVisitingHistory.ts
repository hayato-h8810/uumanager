import { gql } from '@apollo/client'

export default gql`
  mutation deleteVisitingHistory($id: String!) {
    deleteVisitingHistory(input: { id: $id }) {
      id
      urlId
      date
    }
  }
`
