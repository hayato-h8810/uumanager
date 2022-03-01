import { gql } from '@apollo/client'

export default gql`
  mutation editUrl($url: UrlInput!, $folderId: String, $urlId: String!) {
    editUrl(input: { url: $url, folderId: $folderId, urlId: $urlId }) {
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
