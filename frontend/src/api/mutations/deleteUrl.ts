import { gql } from '@apollo/client'

export default gql`
  mutation deleteUrl($urlId: String!, $folderId: String!) {
    deleteUrl(input: { urlId: $urlId, folderId: $folderId }) {
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
