import { gql } from '@apollo/client'

export default gql`
  query fetchFolderUrl {
    fetchFolderUrl {
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
      }
    }
  }
`
