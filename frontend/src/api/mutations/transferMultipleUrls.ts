import { gql } from '@apollo/client'

export default gql`
  mutation transferMultipleUrls($folderAndUrlId: [FolderAndUrlId!]!) {
    transferMultipleUrls(input: { folderAndUrlId: $folderAndUrlId }) {
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
