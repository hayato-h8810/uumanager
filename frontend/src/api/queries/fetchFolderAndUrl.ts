import { gql } from '@apollo/client'

export default gql`
  query fetchFolderAndUrl {
    fetchFolderAndUrl {
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
