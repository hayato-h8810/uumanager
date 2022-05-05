import { gql } from '@apollo/client'

export default gql`
  mutation editUrl($url: UrlInput!, $folderId: String, $urlId: String!, $newFolderName: String) {
    editUrl(input: { url: $url, folderId: $folderId, urlId: $urlId, newFolderName: $newFolderName }) {
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
