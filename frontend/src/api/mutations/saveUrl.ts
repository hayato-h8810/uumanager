import { gql } from '@apollo/client'

export default gql`
  mutation saveUrl($url: UrlInput!, $folderName: String) {
    saveUrl(input: { url: $url, folderName: $folderName }) {
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
