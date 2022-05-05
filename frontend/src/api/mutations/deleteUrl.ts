import { gql } from '@apollo/client'

export default gql`
  mutation deleteUrl($urlId: String!) {
    deleteUrl(input: { urlId: $urlId }) {
      id
      name
      urls {
        id
        title
        memo
        notification
        url
        importance
        folderId
        createdAt
      }
    }
  }
`
