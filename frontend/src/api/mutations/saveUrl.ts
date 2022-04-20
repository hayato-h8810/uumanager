import { gql } from '@apollo/client'

export default gql`
  mutation saveUrl($url: UrlInput!, $folderName: String, $folderId: String) {
    saveUrl(input: { url: $url, folderName: $folderName, folderId: $folderId }) {
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
