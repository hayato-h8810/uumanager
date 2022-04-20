import { gql } from '@apollo/client'

export default gql`
  mutation deleteFolder($folderId: String!) {
    deleteFolder(input: { folderId: $folderId }) {
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
