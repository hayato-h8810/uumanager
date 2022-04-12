import { gql } from '@apollo/client'

export default gql`
  mutation deleteBrowsingHistory($id: String!) {
    deleteBrowsingHistory(input: { id: $id }) {
      id
      urlId
      date
    }
  }
`
